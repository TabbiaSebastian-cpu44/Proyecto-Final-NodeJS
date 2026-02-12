import connectDB from "./config/connectionDB.js"

connectDB()

import express from 'express'
import cors from 'cors'
import ENVIRONMENT from "./config/environment.js"
import authRouter from "./routes/auth.router.js"
import chatRouter from "./routes/chat.router.js"
import messageRouter from "./routes/message.router.js"
import userRouter from "./routes/user.router.js"

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/chats', chatRouter)
app.use('/api/chats', messageRouter)
app.use('/api/users', userRouter)

// Ruta de bienvenida
app.get('/', (request, response) => {
    response.json({
        ok: true,
        status: 200,
        message: 'Hola! como estas? todo bien?',
        data: {
            endpoints: {
                auth: '/api/auth (register, login)',
                chats: '/api/chats',
                messages: '/api/chats/:chat_id/messages',
                users: '/api/users'
            }
        }
    })
})

app.listen(
    ENVIRONMENT.PORT,
    () => {
        console.log(` Servidor corriendo en http://localhost:${ENVIRONMENT.PORT}`)
    }
)
// Exportar para Vercel
export default app