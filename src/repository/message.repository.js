import Message from "../models/message.model.js"

async function createMessage(content, chat_id, sender_user_id) {
    const message = await Message.create({
        content,
        chat_id,
        sender_user_id
    })
    return message
}

async function getMessagesByChatId(chat_id) {
    const messages = await Message.find({ chat_id })
        .populate('sender_user_id', 'email')
        .sort({ created_at: 1 })
    return messages
}

async function deleteMessageById(message_id) {
    const message = await Message.findByIdAndDelete(message_id)
    return message
}

async function getMessageById(message_id) {
    const message = await Message.findById(message_id)
    return message
}

export { 
    createMessage, 
    getMessagesByChatId, 
    deleteMessageById,
    getMessageById
}
