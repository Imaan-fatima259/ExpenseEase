const mongoose = require('mongoose');

const SavingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    targetAmount: {
        type: Number,
        required: true,
        trim: true
    },
    currentAmount: {
        type: Number,
        required: true,
        trim: true
    },
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assuming you have a User model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Saving', SavingSchema);
