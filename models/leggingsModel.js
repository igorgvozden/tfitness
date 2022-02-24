const mongoose = require('mongoose');

const leggingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    colors: [String],
    sizes: [String],
    quantities: [Number],
    description: String,
    active: {
        type: Boolean,
        default: true
    },
    sizeGuides: {
        type: [Number]
    }
});

const Legging = mongoose.model('Legging', leggingSchema);

module.exports = Legging;