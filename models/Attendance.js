const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    present: { type: Boolean, default: false },
    date: { type: String },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true })
attendanceSchema.index({ date: 1, student: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance
