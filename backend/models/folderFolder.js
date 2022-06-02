const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderFolderSchema = Schema({
    parent: {
        type: String,
        required: true
    },
    child: {
        type: Array,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("FolderFolder", folderFolderSchema);