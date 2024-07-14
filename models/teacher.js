const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name: String,
    department: String,
    subject: String,
    email: { type: String, unique: true },
    password: String
});

module.exports = mongoose.model('Teacher', teacherSchema);
