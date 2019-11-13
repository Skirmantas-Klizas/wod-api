const Wod = require('../models/wod');

exports.existingWod = async (req, res, next) => {
    try {
        console.log(req.body.wod);
        if (req.body.wod !== undefined) {
            const wod = await Wod.findById(req.body.wod);
            if (wod !== null) {
                next();
            } else {
                throw Error;
            }
        } else {
            throw Error;
        }
    } catch (err) {
        return res.status(400).json({
            message: 'No wods exist with given ID'
        });
    }
};
