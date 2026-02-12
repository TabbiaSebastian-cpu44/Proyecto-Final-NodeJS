import express from 'express'
import { sendMessage, getChatMessages, deleteMessage } from '../controllers/message.controller.js'
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const messageRouter = express.Router()

// Todas las rutas requieren autenticación
messageRouter.use(authorizationMiddleware)

messageRouter.post('/:chat_id/messages', sendMessage)
messageRouter.get('/:chat_id/messages', getChatMessages)
messageRouter.delete('/:chat_id/messages/:message_id', deleteMessage)

export default messageRouter
