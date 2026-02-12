import express from 'express'
import { getUsers, getUserById } from '../controllers/user.controller.js'
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const userRouter = express.Router()

// Todas las rutas requieren autenticación
userRouter.use(authorizationMiddleware)

userRouter.get('/', getUsers)
userRouter.get('/:user_id', getUserById)

export default userRouter
