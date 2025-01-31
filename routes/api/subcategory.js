const express = require('express');
const router = express.Router();
const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');

// Create subcategory
router.post('/', async (req, res) => {
    try {
        // Verify category exists
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If tax applicability is true, ensure tax amount is provided
        if (req.body.taxApplicable && !req.body.tax) {
            return res.status(400).json({ 
                message: 'Tax amount is required when tax is applicable' 
            });
        }

        const subCategory = await SubCategory.create(req.body);
        await subCategory.populate('category');
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all subcategories
router.get('/', async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category');
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get subcategories by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ category: req.params.categoryId });
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update subcategory
router.put('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(subCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 