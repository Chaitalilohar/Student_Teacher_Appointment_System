const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Appointment = require('../models/appointment');

// Teacher Login
router.get('/login', (req, res) => {
    res.render('teacher/login');
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });
        if (teacher && await bcrypt.compare(password, teacher.password)) {
            req.session.teacherId = teacher._id;
            res.redirect('/teacher/dashboard');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/register', (req, res) => {
    res.render('teacher/register', {
        title: 'Teacher Registration'
    });
});

// Route to handle form submission
router.post('/register', async (req, res) => {
    const { name, department, subject, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new teacher document
        const newTeacher = new Teacher({
            name,
            department,
            subject,
            email,
            password: hashedPassword
        });

        // Save the teacher to the database
        await newTeacher.save();

        // Redirect to the login page or dashboard
        res.redirect('/teacher/login');
    } catch (error) {
        console.error('Error registering teacher:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Teacher Dashboard
router.get('/dashboard', async (req, res) => {
    const teacher = await Teacher.findById(req.session.teacherId);
    res.render('teacher/dashboard', { teacher });
});

// View Appointments
router.get('/appointments', async (req, res) => {
    try {
        // Find all appointments for the teacher and populate the student field
        const appointments = await Appointment.find({ teacherId: req.session.teacherId })
                                              .populate('studentId')  // Make sure this matches your schema
                                              .exec();
        
        res.render('teacher/appointments', {
            title: 'My Appointments',
            appointments: appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

// View Messages
router.get('/messages',async (req, res) => {
    const messages = await Appointment.find({ teacherId: req.session.teacherId })
    .populate('studentId')  // Make sure this matches your schema
    .exec();
    res.render('teacher/messages',{
        messages:messages});
});

// Approve/Cancel Appointments
router.post('/appointments/approve', async (req, res) => {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'approved' });
    res.redirect('/teacher/appointments');
});

router.post('/appointments/cancel', async (req, res) => {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'canceled' });
    res.redirect('/teacher/appointments');
});

module.exports = router;
