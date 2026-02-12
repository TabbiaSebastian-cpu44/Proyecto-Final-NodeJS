import ServerError from "../helpers/serverError.js"
import { createChat, getChatById, getChatsByUserId, deleteChatById, findChatBetweenUsers } from "../repository/chat.repository.js"
import { buscarUserPorId } from "../repository/user.repository.js"
import { getMessagesByChatId } from "../repository/message.repository.js"
import Message from "../models/message.model.js"

export async function createNewChat(request, response) {
    try {
        const { user_id_2 } = request.body
        const user_id_1 = request.user.id

        if (!user_id_2) {
            throw new ServerError('Se requiere el ID del otro usuario', 400)
        }

        if (user_id_1 === user_id_2) {
            throw new ServerError('No puedes crear un chat contigo mismo', 400)
        }

        // Verificar que el usuario 2 existe
        const user2_exists = await buscarUserPorId(user_id_2)
        if (!user2_exists) {
            throw new ServerError('El usuario no existe', 404)
        }

        // Verificar si ya existe un chat entre estos usuarios
        const existing_chat = await findChatBetweenUsers(user_id_1, user_id_2)
        if (existing_chat) {
            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'El chat ya existe',
                data: {
                    chat: existing_chat
                }
            })
        }

        const new_chat = await createChat(user_id_1, user_id_2)
        const chat_populated = await getChatById(new_chat._id)

        response.status(201).json({
            ok: true,
            status: 201,
            message: 'Chat creado exitosamente',
            data: {
                chat: chat_populated
            }
        })
    }
    catch (error) {
        if (error.status) {
            response.status(error.status).json({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        else {
            console.error('Error en createNewChat:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function getUserChats(request, response) {
    try {
        const user_id = request.user.id

        const chats = await getChatsByUserId(user_id)

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Chats obtenidos exitosamente',
            data: {
                chats
            }
        })
    }
    catch (error) {
        console.error('Error en getUserChats:', error)
        response.status(500).json({
            ok: false,
            status: 500,
            message: 'Error interno del servidor'
        })
    }
}

export async function getChatDetails(request, response) {
    try {
        const { chat_id } = request.params
        const user_id = request.user.id

        const chat = await getChatById(chat_id)

        if (!chat) {
            throw new ServerError('Chat no encontrado', 404)
        }

        // Verificar que el usuario pertenece al chat
        if (chat.user_id_1._id.toString() !== user_id && chat.user_id_2._id.toString() !== user_id) {
            throw new ServerError('No tienes acceso a este chat', 403)
        }

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Chat obtenido exitosamente',
            data: {
                chat
            }
        })
    }
    catch (error) {
        if (error.status) {
            response.status(error.status).json({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        else {
            console.error('Error en getChatDetails:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function deleteChat(request, response) {
    try {
        const { chat_id } = request.params
        const user_id = request.user.id

        const chat = await getChatById(chat_id)

        if (!chat) {
            throw new ServerError('Chat no encontrado', 404)
        }

        // Verificar que el usuario pertenece al chat
        if (chat.user_id_1._id.toString() !== user_id && chat.user_id_2._id.toString() !== user_id) {
            throw new ServerError('No tienes acceso a este chat', 403)
        }

        // Eliminar todos los mensajes del chat
        await Message.deleteMany({ chat_id })

        // Eliminar el chat
        await deleteChatById(chat_id)

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Chat eliminado exitosamente',
            data: null
        })
    }
    catch (error) {
        if (error.status) {
            response.status(error.status).json({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        else {
            console.error('Error en deleteChat:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}
