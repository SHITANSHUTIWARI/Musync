/**
 * MUSYNC - Connection Controller
 */

const Connection = require('../models/Connection');
const User = require('../models/User');
const { createNotification } = require('./notification.controller');

/**
 * @desc    Send connection request
 * @route   POST /api/connections/request
 * @access  Private
 */
const sendRequest = async (req, res, next) => {
  try {
    const requester = req.user.id;
    const { recipient } = req.body;

    // Prevent self-request
    if (requester === recipient) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You cannot connect with yourself'
        }
      });
    }

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Recipient user not found'
        }
      });
    }

    // Check if connection already exists (in either direction)
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requester, recipient: recipient },
        { requester: recipient, recipient: requester }
      ]
    });

    if (existingConnection) {
      // If rejected, maybe allow retry? For now, simpler to say it exists.
      return res.status(400).json({
        success: false,
        error: {
          message: 'Connection request already exists or you are already connected'
        }
      });
    }

    // Create request
    const connection = await Connection.create({
      requester,
      recipient,
      status: 'pending'
    });

    // Create notification
    await createNotification({
      recipient,
      sender: requester,
      type: 'connection_request',
      content: 'sent you a connection request',
      relatedId: connection._id
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept or Reject connection request
 * @route   PUT /api/connections/respond/:id
 * @access  Private
 */
const respondRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Connection request not found'
        }
      });
    }

    // Only recipient can respond
    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden: You are not authorization to respond to this request'
        }
      });
    }

    // Ensure request is still pending
    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Connection request is already ${connection.status}`
        }
      });
    }

    connection.status = status;
    connection.updatedAt = new Date();
    await connection.save();

    // Create notification if accepted
    if (status === 'accepted') {
      await createNotification({
        recipient: connection.requester,
        sender: userId,
        type: 'connection_accepted',
        content: 'accepted your connection request',
        relatedId: connection._id
      });
    }

    res.status(200).json({
      success: true,
      message: `Connection request ${status}`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List my connections
 * @route   GET /api/connections
 * @access  Private
 */
const getMyConnections = async (req, res, next) => {
  try {
    const { mongoose } = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const connections = await Connection.aggregate([
      {
        $match: {
          status: 'accepted',
          $or: [{ requester: userId }, { recipient: userId }]
        }
      },
      {
        $addFields: {
          otherUserId: {
            $cond: {
              if: { $eq: ['$requester', userId] },
              then: '$recipient',
              else: '$requester'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'otherUserId',
          foreignField: '_id',
          as: 'u'
        }
      },
      { $unwind: '$u' },
      {
        $lookup: {
          from: 'profiles',
          localField: 'otherUserId',
          foreignField: 'user',
          as: 'p'
        }
      },
      { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          connectedSince: { $ifNull: ['$updatedAt', '$createdAt'] },
          user: {
            _id: '$u._id',
            username: '$u.username',
            role: '$u.role',
            displayName: '$p.displayName',
            avatar: '$p.avatar',
            location: '$p.location'
          }
        }
      },
      { $sort: { connectedSince: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: connections.length,
      connections
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  respondRequest,
  getMyConnections,
  getPendingConnections
};

async function getPendingConnections(req, res, next) {
  try {
    const { mongoose } = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const connections = await Connection.aggregate([
      {
        $match: {
          status: 'pending',
          $or: [{ requester: userId }, { recipient: userId }]
        }
      },
      {
        $addFields: {
          isSender: { $eq: ['$requester', userId] },
          otherUserId: {
            $cond: {
              if: { $eq: ['$requester', userId] },
              then: '$recipient',
              else: '$requester'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'otherUserId',
          foreignField: '_id',
          as: 'u'
        }
      },
      { $unwind: '$u' },
      {
        $lookup: {
          from: 'profiles',
          localField: 'otherUserId',
          foreignField: 'user',
          as: 'p'
        }
      },
      { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          type: { $cond: { if: '$isSender', then: 'sent', else: 'received' } },
          createdAt: 1,
          user: {
            _id: '$u._id',
            username: '$u.username',
            role: '$u.role',
            displayName: '$p.displayName',
            avatar: '$p.avatar',
            location: '$p.location'
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, connections });
  } catch (error) {
    next(error);
  }
}
