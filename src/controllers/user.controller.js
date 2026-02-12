import { getAllUsers, buscarUserPorId } from "../repository/user.repository.js"
import ServerError from "../helpers/serverError.js"

export async function getUsers(request, response) {
    try {
        const users = await getAllUsers()

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Usuarios obtenidos exitosamente',
            data: {
                users
            }
        })
    }
    catch (error) {
        console.error('Error en getUsers:', error)
        response.status(500).json({
            ok: false,
            status: 500,
            message: 'Error interno del servidor'
        })
    }
}

export async function getUserById(request, response) {
    try {
        const { user_id } = request.params

        const user = await buscarUserPorId(user_id)

        if (!user) {
            throw new ServerError('Usuario no encontrado', 404)
        }

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Usuario obtenido exitosamente',
            data: {
                user
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
            console.error('Error en getUserById:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}
