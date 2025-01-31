const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

// Create category
router.post('/', async (req, res) => {
    try {
        // Validate tax fields
        if (req.body.taxApplicable && (!req.body.tax || !req.body.taxType)) {
            return res.status(400).json({ 
                message: 'Tax and tax type are required when tax is applicable' 
            });
        }

        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 