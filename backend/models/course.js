const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    enrollmentLink: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);