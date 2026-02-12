# API de Chat - Backend con Node.js y MongoDB

API REST para aplicación de chat en tiempo real con autenticación JWT.

## Autor
**Octavio Sebastian Tabbia** 

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express 5.x** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcrypt** - Encriptación de contraseñas
- **JWT** - Autenticación con tokens
- **CORS** - Habilitación de peticiones cross-origin

## Estructura del Proyecto

```
chat-api-backend/
├── src/
│   ├── config/
│   │   ├── connectionDB.js
│   │   └── environment.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── helpers/
│   │   └── serverError.js
│   ├── middlewares/
│   │   └── authorizationMiddleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   └── message.model.js
│   ├── repository/
│   │   ├── user.repository.js
│   │   ├── chat.repository.js
│   │   └── message.repository.js
│   ├── routes/
│   │   ├── auth.router.js
│   │   ├── chat.router.js
│   │   ├── message.router.js
│   │   └── user.router.js
│   └── main.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>

# Navegar al directorio
cd chat-api-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar .env.example y editarlo con tus credenciales
cp .env.example .env

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
MONGO_DB_CONNECTION_STRING='mongodb+srv://usuario:password@cluster.mongodb.net/database'
PORT=3000
JWT_SECRET_KEY='tu_clave_secreta_super_segura'
```

## Modelos de Base de Datos

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hasheado con bcrypt),
  created_at: Date
}
```

### Chats
```javascript
{
  _id: ObjectId,
  user_id_1: ObjectId (ref: User),
  user_id_2: ObjectId (ref: User),
  created_at: Date
}
```

### Messages
```javascript
{
  _id: ObjectId,
  content: String (required, max: 1000),
  chat_id: ObjectId (ref: Chat),
  sender_user_id: ObjectId (ref: User),
  created_at: Date
}
```

## Endpoints de la API

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "status": 201,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "usuario@ejemplo.com",
      "created_at": "2026-02-10T12:00:00.000Z"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "ok": true,
  "status": 200,
  "message": "Login exitoso",
  "data": {
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "usuario@ejemplo.com"
    }
  }
}
```

### Usuarios

#### Obtener todos los usuarios
```http
GET /api/users
Authorization: Bearer {token}
```

#### Obtener usuario por ID
```http
GET /api/users/:user_id
Authorization: Bearer {token}
```

### Chats

#### Crear nuevo chat
```http
POST /api/chats
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id_2": "507f1f77bcf86cd799439011"
}
```

#### Obtener mis chats
```http
GET /api/chats
Authorization: Bearer {token}
```

#### Obtener chat por ID
```http
GET /api/chats/:chat_id
Authorization: Bearer {token}
```

#### Eliminar chat
```http
DELETE /api/chats/:chat_id
Authorization: Bearer {token}
```

### Mensajes

#### Enviar mensaje
```http
POST /api/chats/:chat_id/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Hola, ¿cómo estás?"
}
```

#### Obtener mensajes de un chat
```http
GET /api/chats/:chat_id/messages
Authorization: Bearer {token}
```

#### Eliminar mensaje
```http
DELETE /api/chats/:chat_id/messages/:message_id
Authorization: Bearer {token}
```

## Formato de Respuestas

Todas las respuestas siguen el siguiente formato:

### Exitosa
```json
{
  "ok": true,
  "status": 200,
  "message": "Mensaje descriptivo",
  "data": {
    // Datos de la respuesta
  }
}
```

### Error
```json
{
  "ok": false,
  "status": 400,
  "message": "Descripción del error"
}
```

## Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## Autenticación

Todas las rutas excepto `/api/auth/register` y `/api/auth/login` requieren autenticación mediante JWT.

Incluir el token en el header de cada petición:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Validaciones

- Email único por usuario
- Contraseña hasheada con bcrypt (10 rounds)
- No se pueden crear chats duplicados entre los mismos usuarios
- Solo el autor puede eliminar sus propios mensajes
- Solo los participantes pueden acceder a un chat

## Despliegue

El proyecto está listo para desplegarse en:
- Render
- Railway
- Cyclic
- Heroku
- Vercel (solo API)

## Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

**Desarrollo con Node.js - UTN BA**  
Módulo 1 - Unidad 5 - Trabajo Final
