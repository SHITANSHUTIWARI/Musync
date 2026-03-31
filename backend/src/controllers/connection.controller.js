/**
 * MUSYNC - Connection Controller
 */

const Connection = require('../models/Connection');
const User = require('../models/User');

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
    await Connection.create({
      requester,
      recipient,
      status: 'pending'
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
    const userId = req.user.id;

    // Find accepted connections where user is requester OR recipient
    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ requester: userId }, { recipient: userId }]
    })
    .populate('requester', 'username email role') // Basic user info
    .populate('recipient', 'username email role')
    .sort({ updatedAt: -1 });

    // Format results to just return the "other" user
    const formattedConnections = connections.map(conn => {
      const isRequester = conn.requester._id.toString() === userId;
      const otherUser = isRequester ? conn.recipient : conn.requester;
      
      return {
        _id: conn._id,
        connectedSince: conn.updatedAt || conn.createdAt,
        user: {
          _id: otherUser._id,
          username: otherUser.username,
          role: otherUser.role
          // Ideally we would join Profile to get avatar/name, but User info is requested for now. 
          // Task requirement says "Return basic public user info". User collection has username/role.
        }
      };
    });

    res.status(200).json({
      success: true,
      count: formattedConnections.length,
      connections: formattedConnections
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
    const userId = req.user.id;
    const connections = await Connection.find({
      status: 'pending',
      $or: [{ requester: userId }, { recipient: userId }]
    })
    .populate('requester', 'username role')
    .populate('recipient', 'username role')
    .sort({ createdAt: -1 });

    const formatted = connections.map(conn => {
      const isSender = conn.requester._id.toString() === userId;
      const other = isSender ? conn.recipient : conn.requester;
      return {
        _id: conn._id,
        type: isSender ? 'sent' : 'received',
        createdAt: conn.createdAt,
        user: { _id: other._id, username: other.username, role: other.role }
      };
    });

    res.status(200).json({ success: true, connections: formatted });
  } catch (error) {
    next(error);
  }
}
