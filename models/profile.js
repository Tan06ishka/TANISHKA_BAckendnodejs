const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    rollNumber: String,
    class: String,
    department: String,
    teacher: String,
    phone: String
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);