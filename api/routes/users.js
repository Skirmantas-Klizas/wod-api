const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json({
            count: users.length,
            users: users
        });
    } catch {
        res.status(500).json({ message: 'Error while retrieving users data' });
    }
});

router.post('/signup', (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                user.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'User created',
                            createdUser: {
                                _id: result._id,
                                name: result.name,
                                email: result.email
                            }
                        });
                    })
                    .catch(() => {
                        res.status(500).json({
                            message: 'Error while creating a new user1'
                        });
                    });
            }
        })
        .catch(() => {
            res.status(500).json({
                message: 'Error while creating a new user2'
            });
        });
});

router.post('/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        const userResult = await User.findOne({ email: user.email });
        if (userResult === null) {
            return res.status(401).json({ message: 'Auth failed' });
        } else {
            return res.status(200).json({ message: 'Auth successful' });
        }
    } catch {
        res.status(500).json({ message: 'Error while logging in' });
    }
});

router.patch('/:userId', async (req, res) => {
    const id = req.params.userId;
    const set = req.body;
    try {
        const result = await User.updateOne({ _id: id }, set);
        // await Wod.updateOne({ _id: id }, set);
        res.status(200).json({ id: id });
    } catch {
        res.status(404).json({ message: error });
    }
});

router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.deleteOne({ _id: userId });
        if (user.n > 0) {
            res.status(200).json({
                message: 'User deleted'
            });
        } else {
            throw Error;
        }
    } catch {
        res.status(404).json({ message: 'No valid entry found' });
    }
});

module.exports = router;
