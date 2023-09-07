const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
})

const User = mongoose.model('users', usersSchema)

module.exports = User;