const jwt = require('jsonwebtoken');

const authenticatetoken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ error: true, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user; // Attach the user to the request object
        next();
    } catch (error) {
        return res.status(400).json({ error: true, message: 'Invalid token.' });
    }
};

module.exports = authenticatetoken;
