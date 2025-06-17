const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    remaining: {
        type: Number, // Track remaining balance
        required: true,
        default: function () {
            return this.amount; // Default remaining to the amount
        },
    },
   userId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User', // Reference to the User model
           required: true
       },
    isAutomatic: {
        type: Boolean,
        default: false // Indicates if the budget was system-assigned
    }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
