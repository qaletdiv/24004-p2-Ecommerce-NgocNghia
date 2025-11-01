const jwt = require('jsonwebtoken');
const {Account} = require('../models');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    /// Split Bearer token
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        /// No token provided
        return res.status(401).json({ message: 'No token provided' });
    }

    /// Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
        if (err) {
            /// JWT expired or invalid
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }

        const accountId = decodedPayload.account_id;
        if (!accountId) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        if (req.session && req.session.account_id) {
        /// Fetch account from database
        try {
            const account = await Account.findByPk(accountId);
            if (!account) {
                req.session.destroy(err => {
                    if (err) {
                        console.error("Error destroying invalid session", err);
                    }
                    res.status(401).json({message: "Unauthorized: Invalid session. Please login again"});
                })
            } else {
                /// Attach account to request object
                req.account = account;
                next();
            }
        }
        catch (error) {
            console.error("Server error during authentication", error);
            res.status(500).json({ message: "Server error during authentication" });
            next(error);
        }
    } else {
        res.status(401).json({message: "Unauthorized: Please login"});
    }
    })
}
module.exports = authenticateToken;