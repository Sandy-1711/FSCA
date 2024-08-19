const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    mobile: { type: Number, unique: true },
    address: String,
    qualification: String,
})
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;