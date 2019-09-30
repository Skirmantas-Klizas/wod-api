const mongoose = require('mongoose');

const wodSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    workout: { type: String, required: true },
    example: Array
});

module.exports = mongoose.model('Wod', wodSchema);
