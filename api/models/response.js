const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    adjustments: { type: String, required: true }, //rx/sc
    time: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    wod: { type: mongoose.Schema.Types.ObjectId, ref: 'Wod' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Response', responseSchema);
