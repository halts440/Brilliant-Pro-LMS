const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const materialSchema = Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    courses: {
        type: Array,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Material", materialSchema);