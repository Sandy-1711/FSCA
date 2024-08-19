const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    name: String,
    mobile: { type: Number, unique: true, required: true },
    age: Number,
    password: String,
    image: String,
    address: String,
})
const Student = mongoose.model("Student", studentSchema);
module.exports = Student