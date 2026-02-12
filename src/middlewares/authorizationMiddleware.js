import ENVIRONMENT from "../config/environment.js"
import ServerError from "../helpers/serverError.js"
import jwt from "jsonwebtoken"

function authorizationMiddleware(request, response, next) {
    try {
        const authorization_header = request.headers.authorization

        if (!authorization_header) {
            throw new ServerError('No hay token de autorización', 401)
        }

        const auth_token = authorization_header.split(' ')[1]
        if (!auth_token) {
            throw new ServerError('Token inválido', 401)
        }

        const payload = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)
        
        request.user = payload

        next()
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
            console.error('Error en autenticación:', error)
            response.status(401).json({
                ok: false,
                status: 401,
                message: 'Token inválido o expirado'
            })
        }
    }
}

export default authorizationMiddleware
