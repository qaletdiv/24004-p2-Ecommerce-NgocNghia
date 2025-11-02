const express = require ('express');
const router = express.Router();
const {User, Account} = require('../models');

router.get('/check', async (req, res) => {
    try {
        if (req.session && req.session.account_id) {
            // Verify account still exists in database
            const account = await Account.findByPk(req.session.account_id, {
                attributes: ['account_id', 'account_name', 'user_email']
            });
            
            if (account) {
                return res.status(200).json({ 
                    authenticated: true,
                    message: 'Session is valid',
                    account: account
                });
            } else {
                // Account not found, destroy invalid session
                req.session.destroy();
                return res.status(401).json({ 
                    authenticated: false,
                    message: 'Session invalid, account not found' 
                });
            }
        } else {
            return res.status(401).json({ 
                authenticated: false,
                message: 'No active session' 
            });
        }
    } catch (error) {
        console.error('Error checking session:', error);
        return res.status(500).json({ 
            authenticated: false,
            message: 'Server error checking session' 
        });
    }
});

router.get ('/get', (req,res) => {
    if (req.session.views) {
        console.log(req.session);
        res.json({message: "Get session"});
    } else {
        res.json ({message: "No session data"});
    }
})
router.get ('/update', (req,res) => {
    if (req.session.userData) {
        req.session.userData.lastSeen = new Date();
        res.json({message: "Session data update"});
    } else {
        res.json ({message: "No session data. Try/ set first"});
    }
})

router.get ('/destroy', (req,res) => {
    if (req.session) {
        req.session.destroy (err => {
            if (err) {
                console.error ("Error destroying session: ", err);
                return res.status(500).send("Could not destroy session");
            }
            res.json({message: "Session destroyed successfully!"});
        })
    } else {
        res.json({ message: "No active session to destroy"});
    }
})

module.exports = router;