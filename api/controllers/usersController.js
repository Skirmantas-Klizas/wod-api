const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json({
            count: users.length,
            users: users
        });
    } catch {
        res.status(400).json({ message: 'Error while retrieving users data' });
    }
};

exports.login = async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        const userResult = await User.findOne({ email: user.email });
        if (userResult === null) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        bcrypt.compare(user.password, userResult.password, (err, result) => {
            if (err) {
                return res.status(401).json({ message: 'Auth failed' });
            }
            if (result) {
                const generatedToken = jwt.sign(
                    {
                        userId: userResult._id,
                        name: userResult.name,
                        email: userResult.email,
                        role: userResult.role
                    },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: generatedToken
                });
            }
            return res.status(401).json({ message: 'Auth failed' });
        });
    } catch {
        res.status(400).json({ message: 'Error while logging in' });
    }
};

exports.signup = async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        if (user.length > 0) {
            return res
                .status(409)
                .json({ message: 'Account with this email already exists' });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(400).json({ message: err });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        role: req.body.role
                    });

                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User created successfully',
                                createdUser: {
                                    _id: result._id,
                                    name: result.name,
                                    email: result.email,
                                    role: result.role
                                }
                            });
                        })
                        .catch(() => {
                            res.status(400).json({
                                message: 'Error while creating a new user'
                            });
                        });
                }
            });
        }
    } catch {
        res.status(400).json({ message: 'Error while creating a new user' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-__v');
        if (user !== null) {
            res.status(200).json({ user: user });
        } else {
            throw Error;
        }
    } catch {
        res.status(400).json({ message: 'Error while retrieving user data' });
    }
};

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const props = req.body;

        const user = await User.find({ email: props.email });
        if (user.length > 0) {
            return res
                .status(409)
                .json({ message: 'Account with this email already exists' });
        } else {
            const user = await User.updateOne({ _id: userId }, props);
            if (user.n > 0) {
                res.status(200).json({
                    message: 'User updated successfully',
                    userId: userId
                });
            } else {
                throw Error;
            }
        }
    } catch {
        res.status(404).json({ message: 'No valid entry found for this ID' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.deleteOne({ _id: userId });
        if (user.n > 0) {
            res.status(200).json({
                message: 'User deleted successfully',
                userId: userId
            });
        } else {
            throw Error;
        }
    } catch {
        res.status(404).json({ message: 'No valid entry found for this ID' });
    }
};
