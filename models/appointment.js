const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    time: Date,
    message: String,
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
