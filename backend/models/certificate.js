const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = Schema({
    fileName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Certificate", certificateSchema);