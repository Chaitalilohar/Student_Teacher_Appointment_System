const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Appointment = require('../models/appointment');
// Admin Dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
});
// Add Teacher
router.get('/add-teacher', (req, res) => {
    res.render('admin/add-teacher');
});

router.post('/add-teacher', async (req, res) => {
    const { name, department, subject, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({ name, department, subject, email, password: hashedPassword });
    await newTeacher.save();
    res.redirect('/admin');
});

// Manage Teachers
router.get('/manage-teachers', async (req, res) => {
    const teachers = await Teacher.find();
    res.render('admin/manage-teachers', { teachers });
});

// Approve Students
router.get('/approve-students', async (req, res) => {
    const students = await Student.find({ status: 'pending' });
    res.render('admin/approve-students', { students });
});

router.post('/approve-students', async (req, res) => {
    const { studentId } = req.body;
    await Student.findByIdAndUpdate(studentId, { status: 'approved' });
    res.redirect('/approve-students');
});
router.get('/appointments', async (req, res) => {
    try {
        // Fetch pending appointments from the database
        const appointments = await Appointment.find({ status: 'pending' })
            .populate('studentId', 'name')
            .populate('teacherId', 'name');
        
        // Render the admin appointments management view with pending appointments
        res.render('admin/appointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update appointment status
router.post('/appointments/:id/update-status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Update appointment status in the database
        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        res.redirect('/admin/appointments'); // Corrected redirect path
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add routes for updating and deleting teachers

module.exports = router;
