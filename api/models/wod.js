const mongoose = require('mongoose');

const wodSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        title: { type: String, required: true },
        type: { type: String, required: true },
        difficulty: { type: String, required: true },
        workout: { type: String, required: true },
        example: { type: String, required: true }
    },
    { toJSON: { virtuals: true } }
);

wodSchema.virtual('responses', {
    ref: 'Response',
    localField: '_id',
    foreignField: 'wod'
});

module.exports = mongoose.model('Wod', wodSchema);
