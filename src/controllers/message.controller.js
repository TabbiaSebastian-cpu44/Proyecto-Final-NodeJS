import ServerError from "../helpers/serverError.js"
import { createMessage, getMessagesByChatId, deleteMessageById, getMessageById } from "../repository/message.repository.js"
import { getChatById } from "../repository/chat.repository.js"

export async function sendMessage(request, response) {
    try {
        const { chat_id } = request.params
        const { content } = request.body
        const sender_user_id = request.user.id

        if (!content || content.trim() === '') {
            throw new ServerError('El contenido del mensaje es obligatorio', 400)
        }

        // Verificar que el chat existe
        const chat = await getChatById(chat_id)
        if (!chat) {
            throw new ServerError('Chat no encontrado', 404)
        }

        // Verificar que el usuario pertenece al chat
        if (chat.user_id_1._id.toString() !== sender_user_id && chat.user_id_2._id.toString() !== sender_user_id) {
            throw new ServerError('No tienes acceso a este chat', 403)
        }

        const new_message = await createMessage(content, chat_id, sender_user_id)

        // Poblar el sender_user_id para la respuesta
        const message_populated = await getMessageById(new_message._id)
        await message_populated.populate('sender_user_id', 'email')

        response.status(201).json({
            ok: true,
            status: 201,
            message: 'Mensaje enviado exitosamente',
            data: {
                message: message_populated
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
            console.error('Error en sendMessage:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function getChatMessages(request, response) {
    try {
        const { chat_id } = request.params
        const user_id = request.user.id

        // Verificar que el chat existe
        const chat = await getChatById(chat_id)
        if (!chat) {
            throw new ServerError('Chat no encontrado', 404)
        }

        // Verificar que el usuario pertenece al chat
        if (chat.user_id_1._id.toString() !== user_id && chat.user_id_2._id.toString() !== user_id) {
            throw new ServerError('No tienes acceso a este chat', 403)
        }

        const messages = await getMessagesByChatId(chat_id)

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Mensajes obtenidos exitosamente',
            data: {
                messages
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
            console.error('Error en getChatMessages:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function deleteMessage(request, response) {
    try {
        const { chat_id, message_id } = request.params
        const user_id = request.user.id

        // Verificar que el mensaje existe
        const message = await getMessageById(message_id)
        if (!message) {
            throw new ServerError('Mensaje no encontrado', 404)
        }

        // Verificar que el mensaje pertenece al chat especificado
        if (message.chat_id.toString() !== chat_id) {
            throw new ServerError('El mensaje no pertenece a este chat', 400)
        }

        // Verificar que el usuario es el autor del mensaje
        if (message.sender_user_id.toString() !== user_id) {
            throw new ServerError('Solo puedes eliminar tus propios mensajes', 403)
        }

        await deleteMessageById(message_id)

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Mensaje eliminado exitosamente',
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
            console.error('Error en deleteMessage:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}
