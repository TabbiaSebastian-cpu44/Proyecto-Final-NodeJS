import User from "../models/user.model.js"

async function createUser(email, password) {
    const user = await User.create({ email, password })
    return user
}

async function buscarUserPorId(user_id) {
    const user = await User.findById(user_id).select('-password')
    return user
}

async function buscarPorEmail(email) {
    const user = await User.findOne({ email })
    return user
}

async function getAllUsers() {
    const users = await User.find().select('-password').sort({ created_at: -1 })
    return users
}

export { createUser, buscarUserPorId, buscarPorEmail, getAllUsers }
