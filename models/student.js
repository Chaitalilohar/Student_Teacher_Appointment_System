const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    status: { type: String, default: 'pending' }  // Admin approval status
});

module.exports = mongoose.model('Student', studentSchema);
