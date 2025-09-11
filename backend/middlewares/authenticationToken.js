const jwt = require("jsonwebtoken");
const { User } = require('../models')

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Yeu cau token xac thuc' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
        if(err) {
            if(err instanceof jwt.TokenExpiredError) {
                return req.status(401).json({ message: "Tokeb het han" });
            }

            return res.status(403).json({ message: "Token khong hop le" });
        }

        const userId = decodedPayload.userId;
        if(!userId) {
            return res.status(403).json({ message: 'Token khong hop le (thieu thong tin)' });
        }

        try {
            const user = await User.findByPk(userId);
            if(!user) {
                return res.status(401).json({ message: "Xac thuc that bai (Nguoi dung khong ton tai)" });
            }

            req.user = user;
            next();
        } catch (dbError) {
            console.error("Loi truy van nguoi dung trong authenticationToken:", dbError);
            next(dbError);
        }

    })
}

module.exports = authenticationToken;