const mongoose = require('mongoose');
const Response = require('../models/response');
const Wod = require('../models/wod');

exports.getAllResponses = async (req, res) => {
    try {
        const responses = await Response.find().select('-__v');
        res.status(200).json({
            count: responses.length,
            responses: responses
        });
    } catch {
        res.status(400).json({
            message: 'Error while retrieving responses data'
        });
    }
};

exports.postResponse = async (req, res) => {
    const response = new Response({
        _id: new mongoose.Types.ObjectId(),
        adjustments: req.body.adjustments,
        time: req.body.time,
        comment: req.body.comment,
        wod: req.body.wod,
        user: req.userData.userId
    });

    try {
        const result = await response.save();
        res.status(201).json({
            message: 'Response created successfully',
            createdReview: {
                _id: result._id,
                adjustments: result.adjustments,
                time: result.time,
                comment: result.comment,
                wod: result.wod,
                user: result.user
            }
        });
    } catch {
        res.status(400).json({ message: 'Error while posting new response' });
    }
};

exports.getResponse = async (req, res) => {
    const responseId = req.params.responseId;
    try {
        const response = await Response.findById(responseId).select('-__v');
        if (response !== null) {
            res.status(200).json({ response: response });
        } else {
            throw Error;
        }
    } catch {
        res.status(404).json({
            message: 'No valid entry found for provided ID'
        });
    }
};

exports.updateResponse = async (req, res) => {
    const responseId = req.params.responseId;
    const props = req.body;

    try {
        const response = await Response.findById(responseId);
        if (
            (new String(req.userData.userId).valueOf() ===
                new String(response.user).valueOf() &&
                req.userData.userId !== null) ||
            req.userData.role === 'Administrator'
        ) {
            const response = await Response.updateOne(
                { _id: responseId },
                props
            );
            if (response.n > 0) {
                res.status(200).json({
                    message: 'Response updated successfully',
                    responseId: responseId
                });
            } else {
                throw Error;
            }
        } else {
            throw Error;
        }
    } catch {
        res.status(400).json({ message: 'Error while updating response' });
    }
};

exports.deleteResponse = async (req, res) => {
    const responseId = req.params.responseId;
    try {
        const response = await Response.findById(responseId);
        if (
            (new String(req.userData.userId).valueOf() ===
                new String(response.user).valueOf() &&
                req.userData.userId !== null) ||
            req.userData.role === 'Administrator'
        ) {
            const response = await Response.deleteOne({ _id: responseId });
            if (response.n > 0) {
                res.status(200).json({
                    message: 'Response deleted successfully',
                    responseId: responseId
                });
            } else {
                throw Error;
            }
        } else {
            throw Error;
        }
    } catch {
        res.status(400).json({ message: 'Error while deleting response' });
    }
};
