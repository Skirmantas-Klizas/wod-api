const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Responses were fetched'
    });
});

router.post('/', (req, res, next) => {
    const response = {
        wodId: req.body.wodId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Response was created',
        response: response
    });
});

router.get('/:responseId', (req, res, next) => {
    res.status(200).json({
        message: 'Response details',
        response: req.params.responseId
    });
});

router.delete('/:responseId', (req, res, next) => {
    res.status(200).json({
        message: 'Response deleted',
        response: req.params.responseId
    });
});

module.exports = router;
