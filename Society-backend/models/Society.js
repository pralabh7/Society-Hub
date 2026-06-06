const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A society must have a name"],
        unique: true // No two societies can have the same name
    },
    type: {
        type: String, 
        enum: ["Technical", "Cultural", "Sports", "Social"], // Only these values allowed
        default: "Technical"
    },
    head: {
        type: String,
        required: true
    },
    description: String,
    contact: String,
    images: [String], // An array of image URLs
    recruitmentStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('Society', societySchema);