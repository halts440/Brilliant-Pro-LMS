const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = Schema({
    statement: {
       type: String,
       required: true
    },
    options: {
       type: Array,
       required: true
    },
    correctOpt: {
       type: String,
       required: true
    }  
 }, {
    _id: false
})

const assessmentSchema = Schema({
    assessmentName: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    minPassing: {
        type: String,
        required: true
    },
    questions: { type: [questionSchema], required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Assessment", assessmentSchema);