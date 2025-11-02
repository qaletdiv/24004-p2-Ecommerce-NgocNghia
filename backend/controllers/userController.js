const {User, Account} = require('../models');


exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        const user = await User.findByPk(newUser.user_id, {
            include: [{
                model: Account,
                as: 'account',
                attributes: ['account_name', 'user_email']
            }]
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        /// FindPK to find user by user_id
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Account,
                as : 'account',
                attributes: ['account_name', 'user_email']
            }]
        });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        next(error);
    } 
}
exports.updateUser = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const [updateRows] = await User.update(req.body, {
            where: { user_id: userId }
        });
        if (updateRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        const updatedUser = await User.findByPk(userId);
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch(error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        // req.account_id is set by authenticationToken middleware
        // Find the user associated with this account
        const user = await User.findOne({
            where: { account_id: req.account_id },
            attributes: ['user_id', 'user_full_name', 'DOB', 'gender', 'phone_number', 'home_address', 'office_address', 'profile_user_image'],
            include: [{
                model: Account,
                as: 'account',
                attributes: ['account_name', 'user_email']
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json({
            user: user
        });
    } catch (error) {
        next(error);
    }
};
