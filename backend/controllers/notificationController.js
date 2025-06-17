const NotificationSchema = require('../models/NotificationModel');

exports.getNotifications = async (req, res) => {
    const { _id: userId, googleId } = req.user;

    try {
        const notifications = await NotificationSchema.find({ userId: userId || googleId, seen: false });

        // Send the notifications as the response
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
