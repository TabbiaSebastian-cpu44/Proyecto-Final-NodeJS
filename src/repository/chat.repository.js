import Chat from "../models/chat.model.js"

async function createChat(user_id_1, user_id_2) {
    // Ordenar IDs para evitar duplicados (chat entre A-B es igual que B-A)
    const [sortedId1, sortedId2] = [user_id_1, user_id_2].sort()
    
    const chat = await Chat.create({
        user_id_1: sortedId1,
        user_id_2: sortedId2
    })
    return chat
}

async function getChatById(chat_id) {
    const chat = await Chat.findById(chat_id)
        .populate('user_id_1', 'email created_at')
        .populate('user_id_2', 'email created_at')
    return chat
}

async function getChatsByUserId(user_id) {
    const chats = await Chat.find({
        $or: [
            { user_id_1: user_id },
            { user_id_2: user_id }
        ]
    })
    .populate('user_id_1', 'email created_at')
    .populate('user_id_2', 'email created_at')
    .sort({ created_at: -1 })
    
    return chats
}

async function deleteChatById(chat_id) {
    const chat = await Chat.findByIdAndDelete(chat_id)
    return chat
}

async function findChatBetweenUsers(user_id_1, user_id_2) {
    const [sortedId1, sortedId2] = [user_id_1, user_id_2].sort()
    
    const chat = await Chat.findOne({
        user_id_1: sortedId1,
        user_id_2: sortedId2
    })
    return chat
}

export { 
    createChat, 
    getChatById, 
    getChatsByUserId, 
    deleteChatById,
    findChatBetweenUsers 
}
