const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Response = require('../models/response');

router.get('/', async (req, res) => {
    try {
        const responses = await Response.find().select('-__v');
        res.status(200).json({
            count: responses.length,
            responses: responses
        });
    } catch {
        res.status(500).json({ message: error });
    }
});

router.post('/', async (req, res) => {
    const response = new Response({
        _id: new mongoose.Types.ObjectId(),
        normative: req.body.normative,
        time: req.body.time,
        comment: req.body.comment,
        date: req.body.date,
        wod: req.body.wod
    });
    try {
        const result = await response.save();
        res.status(201).json({
            _id: result._id,
            wod: result.wod
        });
    } catch {
        res.status(500).json({ message: 'aaaa' });
    }
});

router.get('/:responseId', async (req, res) => {
    const id = req.params.responseId;
    try {
        const response = await Response.findById(id).select('-__v');

        res.status(200).json({ response: response });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.patch('/:responseId', async (req, res) => {
    const id = req.params.responseId;
    const set = req.body;
    try {
        const result = await Response.updateOne({ _id: id }, set);
        // await Wod.updateOne({ _id: id }, set);
        res.status(200).json({ id: id });
    } catch {
        res.status(404).json({ message: error });
    }
});

router.delete('/:responseId', async (req, res) => {
    const id = req.params.responseId;
    try {
        const response = await Response.deleteOne({ _id: id });
        if (response.n > 0) {
            res.status(200).json({
                message: 'Response deleted successfully',
                id: id
            });
        } else {
            throw Error;
        }
    } catch {
        res.status(404).json({
            message: 'No valid entry found for provided ID'
        });
    }
});

// router.get('/:responseId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Response details',
//         response: req.params.responseId
//     });
// });

// router.delete('/:responseId', (req, res, next) => {
//     res.status(200).json({
//         message: 'Response deleted',
//         response: req.params.responseId
//     });
// });

module.exports = router;
