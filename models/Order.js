const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Simple', 'Intricate', 'Extravagant'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Not Started',
        enum: ['Not Started', 'In Progress', 'Complete']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },


});

module.exports = mongoose.model('Order', OrderSchema);