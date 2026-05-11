const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const Prescription = require('../models/Prescription');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Upload a new prescription
// @route   POST /api/prescriptions/upload
// @access  Public (or Private if we enforce it)
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const { patientName, patientPhone, deliveryAddress, additionalNotes, userId } = req.body;

        const imagePath = req.file.path; // Cloudinary returns the full URL in req.file.path

        const prescription = await Prescription.create({
            user: userId || null,
            images: [imagePath],
            patientName,
            patientPhone,
            deliveryAddress,
            additionalNotes
        });

        res.status(201).json({
            message: 'Prescription uploaded successfully',
            prescription
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update prescription status
// @route   PUT /api/prescriptions/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const prescription = await Prescription.findById(req.params.id);

        if (prescription) {
            prescription.status = status;
            const updatedPrescription = await prescription.save();
            res.json(updatedPrescription);
        } else {
            res.status(404).json({ message: 'Prescription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete a prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (prescription) {
            await prescription.deleteOne();
            res.json({ message: 'Prescription deleted successfully' });
        } else {
            res.status(404).json({ message: 'Prescription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
