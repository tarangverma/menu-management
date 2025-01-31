const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    taxApplicable: {
        type: Boolean,
        default: false
    },
    tax: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
                return !this.taxApplicable || (v > 0);
            },
            message: 'Tax amount is required when tax is applicable'
        }
    },
    taxType: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        required: function() {
            return this.taxApplicable;
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema); 