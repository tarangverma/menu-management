const express = require('express');
const router = express.Router();
const Item = require('../../models/Item');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');

// Create item
router.post('/', async (req, res) => {
    try {
        // Verify category exists
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If subcategory is provided, verify it exists and belongs to the category
        if (req.body.subCategory) {
            const subCategory = await SubCategory.findOne({
                _id: req.body.subCategory,
                category: req.body.category
            });
            if (!subCategory) {
                return res.status(404).json({ 
                    message: 'SubCategory not found or does not belong to the specified category' 
                });
            }
        }

        // Validate tax fields
        if (req.body.taxApplicable && !req.body.tax) {
            return res.status(400).json({ 
                message: 'Tax amount is required when tax is applicable' 
            });
        }

        const item = await Item.create(req.body);
        await item.populate([
            { path: 'category' },
            { path: 'subCategory' }
        ]);
        
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate({
            path: 'subCategory',
            populate: {
                path: 'category'
            }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get items by subcategory
router.get('/subcategory/:subCategoryId', async (req, res) => {
    try {
        const items = await Item.find({ subCategory: req.params.subCategoryId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search items by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({ 
                message: 'Search term is required' 
            });
        }

        const items = await Item.find({
            name: { $regex: name, $options: 'i' }
        }).populate({
            path: 'subCategory',
            populate: {
                path: 'category'
            }
        });

        if (items.length === 0) {
            return res.status(404).json({
                message: 'No items found matching the search term',
                searchTerm: name
            });
        }

        res.json({
            count: items.length,
            items: items
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update item
router.put('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 