const mongoose = require('mongoose')
const crypto = require('crypto')

var User = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
    },

    role: {
        type: String,
        default: 'user',
    },

    cart: {
        type: String,
        // default: []
    },

    address: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Address'
        }
    ],

    wishlist: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'product'
        }
    ],

    isBlocked: {
        type: Boolean,
        default: false
    },

    refresh_token: {
        type: String
    },

    passwordChangeAt: {
        type: String
    },

    passwordResetToken: {
        type: String
    },

    passwordResetExpires: {
        type: String
    }
}, { timestamps: true })

User.methods.createPasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000

    return resetToken
}


module.exports = mongoose.model('User', User);