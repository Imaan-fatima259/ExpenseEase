const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure this is the same secret used when signing
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};


module.exports = {ensureAuthenticated};
