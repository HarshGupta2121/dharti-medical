const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest uploads logic if needed, or strictly require auth
    },
    images: [{
        type: String,
        required: true
    }],
    patientName: {
        type: String,
        required: true
    },
    patientPhone: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    additionalNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
