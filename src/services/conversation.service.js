const httpStatus = require('http-status');
const { Conversation,Message } = require('../models');
const ApiError = require('../utils/ApiError');




/**
 * Create a new conversation
 * @param {Object} conversationBody
 * @returns {Promise<Conversation>}
 */
const createConversation = async (conversationBody) => {
    return Conversation.create(conversationBody);
  };
  


  /**
   * Create a new message for a conversation
   * @param {Object} messageBody
   * @returns {Promise<Message>}
   */

  const createMessage = async (messageBody) => {
    return Message.create(messageBody);
  };

/**
 * Get all conversations for a specific user
 * @param {string} userid - The ID of the user
 * @returns {Promise<Array>} - List of conversations
 */
const listConversationsByUser = async (userid) => {
  return Conversation.find({ userid })
    .populate('topicid','topic_name') // Populate topic information
    .sort({ createdAt: -1 }); // Sort by most recent
};


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getconversationById = async (id) => {
    return Conversation.findById(id).populate('topicid', 'topic_name');
  };



const getConversationByTopicAndUser = async (topicid, userid) => {
    return await Conversation.findOne({ topicid, userid });
};

module.exports = {
    createConversation,
    listConversationsByUser,
    createMessage,
    getconversationById
};
