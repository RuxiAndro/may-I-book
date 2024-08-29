const mongoose = require("mongoose");
const { Hotel } = require("../model/Hotel");
const { authenticateJWT, authorizeRole } = require("../middleware/authMiddleware");

mongoose.connect("mongodb://localhost:27017/db-for-booking")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = async (req, res) => {
  if (req.method === "POST") {
    await createHotel(req, res);
  } else if (req.method === "GET") {
    await getRoomsByHotelId(req, res);
  } else if (req.method === "PUT") {
    await addRoomToHotel(req, res);
  } else {
    res.status(405).end();
  }
};

const createHotel = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["admin"], req, res, async () => {
      const { name, address, numberOfRooms, rooms } = req.body;
      try {
        const newHotel = new Hotel({ name, address, numberOfRooms, rooms });
        await newHotel.save();
        res.status(201).json(newHotel);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });
  });
};

const addRoomToHotel = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner"], req, res, async () => {
      const { id } = req.query;
      const roomData = req.body;
      try {
        const hotel = await Hotel.findById(id);
        if (!hotel) {
          return res.status(404).send("Hotel not found");
        }
        hotel.rooms.push(roomData);
        hotel.numberOfRooms = hotel.rooms.length;
        await hotel.save();
        res.status(201).json(hotel);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });
  });
};

const getRoomsByHotelId = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner", "admin"], req, res, async () => {
      const { id } = req.query;
      try {
        const hotel = await Hotel.findById(id).populate("rooms");
        if (!hotel) {
          return res.status(404).send("Hotel not found");
        }
        res.status(200).json(hotel.rooms);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
};
