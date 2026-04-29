/**
 * MUSYNC - Chat Controller
 */

const Message = require('../models/Message');
const Connection = require('../models/Connection');
const User = require('../models/User');
const socketService = require('../socket');

/**
 * @desc    Send a message
 * @route   POST /api/chat/send
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user.id;
    const { receiver, content } = req.body;

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Receiver not found'
        }
      });
    }

    // Check connection exists
    const connection = await Connection.findOne({
      status: 'accepted',
      $or: [
        { requester: sender, recipient: receiver },
        { requester: receiver, recipient: sender }
      ]
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You can only message connected users'
        }
      });
    }

    // Create message
    const message = await Message.create({
      sender,
      receiver,
      content,
      read: false
    });

    // Populate sender/receiver info for response
    await message.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'receiver', select: 'username avatar' }
    ]);

    // Create notification
    const { createNotification } = require('./notification.controller');
    await createNotification({
      recipient: receiver,
      sender,
      type: 'new_message',
      content: 'sent you a new message',
      relatedId: message._id
    });

    // Emit via socket
    socketService.emitToUser(receiver, 'message:receive', message);

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history
 * @route   GET /api/chat/:userId
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    // Fetch messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar');

    // Mark received messages as read (optional, but good UX)
    // Only mark messages sent by OTHER user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages
};
