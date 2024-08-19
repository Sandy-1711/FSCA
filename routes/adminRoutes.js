const router = require('express').Router();
const Admin = require('../models/Admin');
const { verifyToken } = require('../middlewares/verifyToken');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');


router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        if (!mobile || !password) {
            return res.status(402).json({ success: false, message: "Please provide mobile and password" });
        }
        const admin = await Admin.findOne({ mobile: mobile });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        const isMatch = await bcrypt.compareSync(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Wrong Password" });
        }
        const token = jwt.sign({ _id: admin._id, }, process.env.JWT_SECRET);
        res.status(200).json({ success: true, message: 'Logged in successfully', token, token, user: admin });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.delete('/:id/:studentid', verifyToken, async (req, res) => {
    console.log('deleting');

    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.studentid);
        return res.status(200).json({ success: true, message: 'Student deleted successfully', student: deletedStudent });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const hashedPassword = await bcrypt.hashSync(req.body.password);
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            image: req.body.image,
            mobile: req.body.mobile,
            address: req.body.address,
            qualification: req.body.qualification
        });
        const savedAdmin = await newAdmin.save();
        return res.status(200).json({ success: true, message: 'Admin added successfully', admin: savedAdmin });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.post('/add-student/:id', verifyToken, async (req, res) => {
    try {
        const { name, age, mobile, image, address } = req.body;
        if (!name || !age || !mobile || !address) {
            return res.status(402).json({ success: false, message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hashSync("7789");
        const newStudent = new Student({
            name: name,
            age: age,
            password: hashedPassword,
            image: image,
            mobile: mobile,
            address: address,
        });
        const savedStudent = await newStudent.save();
        return res.status(200).json({ success: true, message: 'Student added successfully', student: savedStudent });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.get('/get-students/:id', verifyToken, async (req, res) => {

    try {
        const students = await Student.find().sort('name');
        return res.status(200).json({ success: true, message: 'Students fetched successfully', students });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.post('/mark-attendance/:id', verifyToken, async (req, res) => {
    try {
        const attendance = await Attendance.insertMany(req.body);
        return res.status(200).json({ success: true, message: 'Attendance marked successfully' });
    }
    catch (err) {
        console.log(err);
        if (err.code == 11000) return res.status(400).json({ success: false, message: "Attendance already marked" });
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.get('/get-attendance/:id', verifyToken, async (req, res) => {
    try {
        const attendance = (await Attendance.find({ date: (req.query.date) }).populate({
            path: 'student',
            select: 'name'
        }));
        return res.status(200).json({ success: true, message: 'Attendance fetched successfully', attendance });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
})
router.get('/get-attendance/:id/:studentid', verifyToken, async (req, res) => {
    console.log(req.params.studentid);
    try {
        const foundAttendance = await Attendance.find({ student: req.params.studentid }).populate({
            path: 'student',
            select: 'name'
        });
        return res.status(200).json({ success: true, message: 'Attendance fetched successfully', attendance: foundAttendance });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: 'Server Error' })
    }
})
module.exports = router