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

        /// Fetch account from database
        try {
            const account = await Account.findByPk(accountId);
            if (!account) {
                return res.status(401).json({message: "Unauthorized: Account not found"});
            }
            
            /// Attach both account object and account_id to request
            req.account = account;
            req.account_id = accountId;

            if (req.session) {
                req.session.account_id = accountId;
            }
            
            next();
        }
        catch (error) {
            console.error("Server error during authentication", error);
            res.status(500).json({ message: "Server error during authentication" });
            next(error);
        }
    })
}
module.exports = authenticateToken;