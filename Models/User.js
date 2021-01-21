const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sentMessages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    error: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('User', userSchema)