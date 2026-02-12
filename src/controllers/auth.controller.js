import bcrypt from "bcrypt"
import ServerError from "../helpers/serverError.js"
import { buscarPorEmail, createUser } from "../repository/user.repository.js"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/environment.js"

export async function register(request, response) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            throw new ServerError('Email y contraseña son obligatorios', 400)
        }

        const user_found = await buscarPorEmail(email)
        if (user_found) {
            throw new ServerError('El usuario ya existe', 400)
        }

        const password_crypted = await bcrypt.hash(password, 10)

        const new_user = await createUser(email, password_crypted)

        response.status(201).json({
            ok: true,
            status: 201,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: new_user._id,
                    email: new_user.email,
                    created_at: new_user.created_at
                }
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
            console.error('Error en register:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}

export async function login(request, response) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            throw new ServerError('Email y contraseña son obligatorios', 400)
        }

        const user_found = await buscarPorEmail(email)
        if (!user_found) {
            throw new ServerError('Credenciales incorrectas', 401)
        }

        const isSamePassword = await bcrypt.compare(password, user_found.password)
        if (!isSamePassword) {
            throw new ServerError('Credenciales incorrectas', 401)
        }

        const auth_token = jwt.sign(
            {
                email: user_found.email,
                id: user_found._id,
                created_at: user_found.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        response.status(200).json({
            ok: true,
            status: 200,
            message: 'Login exitoso',
            data: {
                auth_token,
                user: {
                    id: user_found._id,
                    email: user_found.email
                }
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
            console.error('Error en login:', error)
            response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }
}
