const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  amount: {
    type: Number,
    required: true,
    maxLength: 20,
    // trim is not applicable to numbers, so we remove it
  },
  type: {
    type: String,
    default: "expense"
  },
  date: {
    type: Date,
    required: true,
    // trim is not applicable to Date, so remove it
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 100, // increased maxLength for more descriptive text
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrence: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom', null],
    default: null,
  },
  nextOccurrence: {
    type: Date,
    default: null,
  },
  recurrenceEndDate: {     // <-- Add this to stop recurring after certain date
    type: Date,
    default: null,
  },
  priority: { 
    type: String, 
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);