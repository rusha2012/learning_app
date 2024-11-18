const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');


const sendmessage = catchAsync(async (req, res) => {

    const { topicid, userid, message, message_type } = req.body;

    const newConversation = await conversationService.createConversation({
        start_date: new Date(),
        topicid,
        userid,
    });

    const newMessage = await conversationService.createMessage({
        message,
        message_type: message_type,
        conversationid: newConversation._id,
        userid,
    });


    let aiResponse = "This is an AI-generated response to your message.";

    const aiMessage = aiResponse;  

    const newAiMessage = await conversationService.createMessage({
        message: aiMessage,
        message_type: message_type, 
        conversationid: newConversation._id,
        userid,  
    });

    res.status(httpStatus.CREATED).send({
        conversation: newConversation,
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
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.CREATED).send({
        data
    });
  });

module.exports = {
    sendmessage,
    list_conversation,
    get_conversation
};
