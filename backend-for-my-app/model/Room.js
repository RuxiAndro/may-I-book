const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    number: { type: Number, required: true }, 
    pricePerNight: { type: Number, required: true }, 
    type: { type: String, required: true }, 
    capacity: { type: Number, required: true }, 
    availabilityStartDate: { type: Date, required: true }, 
    availabilityEndDate: { type: Date, required: true }, 
    imagePath: { type: String, required: true }, 
});

const Room = mongoose.model('Room', roomSchema);

module.exports = { Room, roomSchema };
