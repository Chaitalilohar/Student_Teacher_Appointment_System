const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose');

// Student Registration
router.get('/register', (req, res) => {
    res.render('student/register');
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ name, email, password: hashedPassword });
        await newStudent.save();
        res.redirect('/student/login');
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Student Login
router.get('/login', (req, res) => {
    res.render('student/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (student && await bcrypt.compare(password, student.password)) {
            req.session.studentId = student._id;
            res.redirect('/student/dashboard');
        } else {
            res.redirect('/student/login');
        }
    } catch (error) {
        console.error('Error during student login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Search Teacher
router.get('/search-teacher', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.render('student/search-teacher', { teachers });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Student Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch the student data based on session or any other criteria
        const studentId = req.session.studentId; // Assuming studentId is stored in session
        const student = await Student.findById(studentId);

        if (!student) {
            // Handle case where student is not found
            return res.status(404).send('Student not found');
        }

        // Render the dashboard view with student data
        res.render('student/dashboard', { student });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Internal Server Error');
    }
});
//viw appointment
// Book Appointment
router.get('/book-appointment/:teacherId', (req, res) => {
    res.render('student/book-appointment', { teacherId: req.params.teacherId });
});

router.post('/book-appointment/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    const { time, message } = req.body;
    const studentId = req.session.studentId; // Ensure student is logged in and ID is stored in session

    try {
        const newAppointment = new Appointment({
            studentId,
            teacherId,
            time,
            message,
            status: 'pending'
        });

        // Save the appointment to the database
        await newAppointment.save();

        // Redirect to the view-appointments page with the teacher ID
        res.redirect(`/student/view-appointments`);
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Internal Server Error');
    }
});

// View Appointments
router.get('/view-appointments', async (req, res) => {
    try {
        const studentId = req.session.studentId; // Assuming studentId is stored in session

        if (!studentId) {
            return res.redirect('/student/login'); // Redirect if student is not logged in
        }

        // Fetch appointments for the current student and populate teacher details
        const appointments = await Appointment.find({ studentId })
            .populate('teacherId', 'name');  // Populate to get teacher details

        res.render('student/view-appointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
