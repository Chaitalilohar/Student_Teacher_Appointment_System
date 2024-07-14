const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('layout', {
        title: 'Welcome to Student-Teacher Booking',
        partial: 'partials/index'
    });
});

module.exports = router;
