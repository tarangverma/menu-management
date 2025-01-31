const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    taxApplicable: {
        type: Boolean,
        required: true
    },
    tax: {
        type: Number,
        validate: {
            validator: function(v) {
                return !this.taxApplicable || (v > 0);
            },
            message: 'Tax amount is required when tax is applicable'
        }
    },
    baseAmount: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
itemSchema.pre('save', function(next) {
    this.totalAmount = this.baseAmount - this.discount;
    next();
});

module.exports = mongoose.model('Item', itemSchema); 