const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userName: { type: String, required: true },
    totalCost: { type: Number, required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
