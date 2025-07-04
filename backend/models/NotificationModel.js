const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
