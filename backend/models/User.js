const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gravatar = require('gravatar');

const UserSchema = new Schema({
    name: {
        type: String,
        required: function () { return !this.googleId; } // Required for traditional login
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; } // Required for traditional login
    },
    googleId: {
        type: String,
        default: null
    },
    displayName: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: function () {
            return gravatar.url(this.email, { s: '200', d: 'identicon' }, true);
        }
    },
    plan: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    }
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;