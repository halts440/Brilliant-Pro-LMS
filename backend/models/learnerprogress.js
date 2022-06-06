const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const learnerProgressSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    materials: {
        type: []
    },
    assessments: {
        type: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("LearnerProgress", learnerProgressSchema);