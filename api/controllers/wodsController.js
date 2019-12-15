const mongoose = require('mongoose');
const Wod = require('../models/wod');
const Response = require('../models/response');

exports.getAllWods = async (req, res) => {
    try {
        const wods = await Wod.find()
            .select('-__v')
            .populate({
                path: 'responses',
                populate: {
                    path: 'user'
                }
            });

        res.status(200).json({
            count: wods.length,
            wods: wods
        });
    } catch {
        res.status(400).json({ message: 'Error while retrieving wods data' });
    }
};

// exports.getAllWods = async (req, res) => {
//     try {
//         const wods = await Wod.find().select('-__v');

//         res.status(200).json({
//             count: wods.length,
//             wods: wods
//         });
//     } catch {
//         res.status(400).json({ message: 'Error while retrieving wods data' });
//     }
// };

exports.postWod = async (req, res) => {
    try {
        const wod = new Wod({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            type: req.body.type,
            difficulty: req.body.difficulty,
            workout: req.body.workout,
            example: req.body.example
        });

        const result = await wod.save();
        await result.populate('responses').execPopulate();
        res.status(201).json({
            message: 'Wod created successfully',
            createdWod: {
                _id: result._id,
                title: result.title,
                type: result.type,
                difficulty: result.difficulty,
                workout: result.workout,
                example: result.example,
                responses: result.responses
            }
            // res.status(201).json({
            //     message: 'Wod created successfully',
            //     createdWod: {
            //         _id: result._id,
            //         title: result.title,
            //         type: result.type,
            //         difficulty: result.difficulty,
            //         workout: result.workout,
            //         example: result.example
            //     }
        });
    } catch {
        res.status(400).json({ error: 'Error while posting a new wod' });
    }
};

exports.getWod = async (req, res) => {
    try {
        const wodId = req.params.wodId;
        const wod = await Wod.findById(wodId)
            .select('-__v')
            .populate('responses');
        res.status(200).json({ wod: wod });
    } catch {
        res.status(404).json({
            message: 'No valid entry found for provided ID'
        });
    }
};

exports.updateWod = async (req, res) => {
    try {
        const wodId = req.params.wodId;
        const props = req.body;
        await Wod.updateOne({ _id: wodId }, props);
        res.status(200).json({
            message: 'Wod updated successfully',
            wodId: wodId
        });
    } catch {
        res.status(404).json({
            message: 'No valid entry found for provided ID'
        });
    }
};

exports.deleteWod = async (req, res) => {
    try {
        let wodId = req.params.wodId;
        const wod = await Wod.deleteOne({ _id: wodId });
        if (wod.n > 0) {
            Response.deleteMany({ wod: wodId })
                .exec()
                .then(responses => {
                    if (responses.n > 0) {
                        res.status(200).json({
                            message: 'Wod deleted successfully',
                            responsesId: wodId
                        });
                    } else {
                        res.status(200).json({
                            message: 'Wod deleted successfully',
                            responsesId: wodId
                        });
                    }
                });
        } else {
            throw Error;
        }
    } catch {
        res.status(400).json({ error: 'Error while deleting a wod' });
    }
};
