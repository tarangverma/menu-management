const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    taxApplicable: {
        type: Boolean
    },
    tax: {
        type: Number,
        validate: {
            validator: function(v) {
                return !this.taxApplicable || (v > 0);
            },
            message: 'Tax amount is required when tax is applicable'
        }
    }
}, {
    timestamps: true
});

// Pre-save middleware to set default tax values from category
subCategorySchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('category')) {
        try {
            const category = await mongoose.model('Category').findById(this.category);
            if (category) {
                if (this.taxApplicable === undefined) {
                    this.taxApplicable = category.taxApplicable;
                }
                if (this.tax === undefined && this.taxApplicable) {
                    this.tax = category.tax;
                }
            }
        } catch (error) {
            next(error);
        }
    }
    next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema); 