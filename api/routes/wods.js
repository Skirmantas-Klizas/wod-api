const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Wod = require('../models/wod');

router.get('/', async (req, res) => {
    try {
        const wods = await Wod.find().select('-__v');
        res.status(200).json({
            count: wods.length,
            wods: wods
        });
    } catch {
        res.status(500).json({ message: error });
    }
});

// router.get('/', (req, res, next) => {
//     Wod.find()
//         .exec()
//         .then(docs => {
//             console.log(docs);
//             // if(docs.length >= 0){
//             res.status(200).json(docs);
//             // } else {
//             //     res.status(404).json({
//             //         message: 'No entries found'
//             //     })
//             // };
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({
//                 error: error
//             });
//         });
// });

// router.post('/', (req, res, next) => {
//     const wod = new Wod({
//         _id: new mongoose.Types.ObjectId(),
//         title: req.body.title,
//         type: req.body.type,
//         difficulty: req.body.difficulty,
//         workout: req.body.workout
//     });
//     wod.save().then(result => {
//         console.log(result);
//         res.status(201)
//             .json({
//                 message: 'Handling POST requests to /wods',
//                 createdWod: result
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.status(500).json({
//                     error: error
//                 });
//             });
//     });
// });

router.post('/', async (req, res) => {
    const wod = new Wod({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        type: req.body.type,
        difficulty: req.body.difficulty,
        workout: req.body.workout,
        example: req.body.example
    });
    try {
        await wod.save();
        res.status(201).json({ wod: wod });
    } catch {
        res.status(500).json({ message: error });
    }
});

router.get('/:wodId', async (req, res) => {
    const id = req.params.wodId;
    try {
        const wod = await Wod.findById(id).select('-__v');

        res.status(200).json({ wod: wod });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// router.get('/:wodId', (req, res, next) => {
//     const id = req.params.wodId;
//     Wod.findById(id)
//         .exec()
//         .then(doc => {
//             console.log('From database', doc);
//             if (doc) {
//                 res.status(200).json(doc);
//             } else {
//                 res.status(404).json({
//                     message: 'No valid entry found for provided ID'
//                 });
//             }
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({ error: error });
//         });
// });

// router.patch('/:wodId', (req, res, next) => {
//     const id = req.params.wodId;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }
//     Wod.update({ _id: id }, { $set: updateOps })
//         .exec()
//         .then(result => {
//             console.log(result);
//             res.status(200).json(result);
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({
//                 error: error
//             });
//         });
// });

router.patch('/:wodId', async (req, res) => {
    const id = req.params.wodId;
    const set = req.body;
    try {
        await Wod.updateOne({ _id: id }, set);
        res.status(200).json({ id: id });
    } catch {
        res.status(404).json({ message: error });
    }
});

router.delete('/:wodId', (req, res, next) => {
    const id = req.params.wodId;
    Wod.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router;
