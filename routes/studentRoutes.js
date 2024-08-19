const router = require('express').Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        if (!mobile || !password) {
            return res.status(402).json({ success: false, message: "Please provide mobile and password" });
        }
        const student = await Student.findOne({ mobile: mobile });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        const isMatch = await bcrypt.comparePassword(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Wrong Password" });
        }
        const token = jwt.sign({ id: student._id, }, process.env.JWT_SECRET);
        res.status(200).json({ success: true, message: 'Logged in successfully', token, token, user: student });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error"});
    }
})


module.exports = router;