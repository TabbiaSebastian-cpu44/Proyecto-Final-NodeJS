import express from 'express'
import { createNewChat, getUserChats, getChatDetails, deleteChat } from '../controllers/chat.controller.js'
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const chatRouter = express.Router()

// Todas las rutas requieren autenticación
chatRouter.use(authorizationMiddleware)

chatRouter.post('/', createNewChat)
chatRouter.get('/', getUserChats)
chatRouter.get('/:chat_id', getChatDetails)
chatRouter.delete('/:chat_id', deleteChat)

export default chatRouter
