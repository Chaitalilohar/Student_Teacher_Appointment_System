const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('./config/database');

const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'bookingSystemSecret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Set up routes
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
