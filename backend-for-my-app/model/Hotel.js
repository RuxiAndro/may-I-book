const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { roomSchema } = require('./Room'); //import schema Room
//const Room = require('./Room');

const hotelSchema = new Schema({
    numberOfRooms: { type: Number, required:true },//require =true inseamna ca trebuie sa am campul completat neaparat
    name: {type: String, required: true},
    location: {type:String, required:true},
    description: {type:String, required:true},
    rooms: [roomSchema]
   // rooms: [Room.schema]
    
});

/*class Hotel{
    constructor(numberOfRooms,name,location,description){
        this.numberOfRooms=numberOfRooms;
        this.name=name;
        this.location=location;
        this.description=description;
    }

    static getModel(){
        return mongoose.model('Hotel',hotelSchema);//modelul ca in java va fi Room; modelul este o clasa cu care voi crea documente (obiecte in java)
    }
}*/

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
