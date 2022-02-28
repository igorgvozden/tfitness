const mongoose = require('mongoose');

const leggingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    item: {
        type: String, // da li je set ili samo helanke na primer
        required: true,
        lowercase: true
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