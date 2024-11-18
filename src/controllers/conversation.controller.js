const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');


const sendmessage = catchAsync(async (req, res) => {

    const { topicid, userid, message, message_type } = req.body;

    let conversation = await conversationService.getConversationByTopicAndUser(topicid, userid);

    if (!conversation) {
        // If no conversation exists, create a new one
        conversation = await conversationService.createConversation({
            start_date: new Date(),
            topicid,
            userid,
        });
    }

    const newMessage = await conversationService.createMessage({
        message,
        message_type: message_type,
        conversationid: conversation._id,
        userid,
    });


    let aiResponse = "This is an AI-generated response to your message.";

    const aiMessage = aiResponse;  

    const newAiMessage = await conversationService.createMessage({
        message: aiMessage,
        message_type: message_type, 
        conversationid: conversation._id,
        userid,  
    });

    res.status(httpStatus.CREATED).send({
        conversation: conversation,
        message: newMessage,
        AiResponse:newAiMessage
    });
});


const list_conversation = catchAsync (async(req,res)=>{
    const {id} = req.user;
    const data = await conversationService.listConversationsByUser(id);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'conversation not found');
    }
    res.status(httpStatus.OK).send({
      data
    });
})

const get_conversation = catchAsync(async (req, res) => {
    const {conversation_id} = req.query;
    const data = await conversationService.getconversationById(conversation_id);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    res.status(httpStatus.CREATED).send({
        data
    });
  });

const get_allmessage = catchAsync(async (req, res) => {
    const {conversation_id} = req.query;
    const options = {
      limit: parseInt(req.query.limit, 10) || 10, // Default to 10 if 'limit' is not provided
      page: parseInt(req.query.page, 10) || 1    // Default to 1 if 'page' is not provided
    };
    const data = await conversationService.getAllMessages(conversation_id,options);
    
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.CREATED).send({
        data
    });
  });


module.exports = {
    sendmessage,
    list_conversation,
    get_conversation,
    get_allmessage
};
