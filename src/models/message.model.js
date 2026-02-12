import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    chat_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

// Índice para mejorar búsquedas por chat
messageSchema.index({ chat_id: 1, created_at: -1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
