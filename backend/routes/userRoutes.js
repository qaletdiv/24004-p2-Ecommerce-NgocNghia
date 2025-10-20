const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll ({
            include: [{
                model: Account,
                as: 'account',
            }]
        });
        res.json(users);
    } catch (error) {
        next(error)
    }
});

module.exports = router;