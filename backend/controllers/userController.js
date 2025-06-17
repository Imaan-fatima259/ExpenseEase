const multer = require('multer');
const path = require('path');
const UserModel = require('../models/User');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname); // Adding timestamp to avoid name collisions
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
        }
    }
}).single('profilePicture');  // Expecting the uploaded file to be named 'profilePicture'

// Route handler for updating profile picture
exports.uploadProfilePicture = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const { _id: userId } = req.user;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Save filename (not path) in database
            user.profilePicture = req.file.filename;
            await user.save();

            res.status(200).json({ message: "Profile picture updated successfully", profilePicture: req.file.filename });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });
};

// Route handler for getting user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { _id: userId, googleId } = req.user;  // Extract userId or googleId
        const user = await UserModel.findOne({ _id: userId || googleId });  // Use findOne for a single result

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);  // Send the user data as response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Route handler for updating user profile
exports.updateUserProfile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, email } = req.body;
        const { id } = req.params;
        const { _id: userId, googleId } = req.user;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required.' });
        }

        try {
            const user = await UserModel.findOne({
                _id: id,
                $or: [{ _id: userId }, { googleId: googleId }],
            });

            if (!user) {
                return res.status(404).json({ message: "Profile not found or you are not authorized to edit this record" });
            }

            // Update fields
            user.name = name;
            user.email = email;
            if (req.file) {
                user.profilePicture = req.file.filename;  // Save filename for profile picture
            }

            const updatedUser = await user.save();
            res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};
