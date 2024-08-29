const mongoose = require("mongoose");
const { Room } = require("../model/Room"); // Ajustează calea în funcție de structura ta
const { authenticateJWT, authorizeRole } = require("../middleware/authMiddleware");

mongoose.connect("mongodb://localhost:27017/db-for-booking")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = async (req, res) => {
  if (req.method === "POST") {
    await createRoom(req, res);
  } else if (req.method === "GET") {
    if (req.query.id) {
      await getRoomById(req, res);
    } else {
      await getAllRooms(req, res);
    }
  } else if (req.method === "PUT") {
    await updateRoom(req, res);
  } else if (req.method === "DELETE") {
    await deleteRoom(req, res);
  } else {
    res.status(405).end(); // Metoda nu este permisă
  }
};

const createRoom = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner"], req, res, async () => {
      const { number, pricePerNight, type, capacity, availabilityStartDate, availabilityEndDate, imagePath } = req.body;
      try {
        const newRoom = new Room({ number, pricePerNight, type, capacity, availabilityStartDate, availabilityEndDate, imagePath });
        await newRoom.save();
        res.status(201).json(newRoom);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });
  });
};

const getAllRooms = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner", "admin"], req, res, async () => {
      try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
};

const getRoomById = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner", "admin"], req, res, async () => {
      const { id } = req.query;
      try {
        const room = await Room.findById(id);
        if (!room) {
          return res.status(404).send("Room not found!");
        }
        res.status(200).json(room);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
};

const updateRoom = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner"], req, res, async () => {
      const { id } = req.query;
      const updateData = req.body;
      try {
        const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedRoom) {
          return res.status(404).send("Room not found!");
        }
        res.status(200).json(updatedRoom);
      } catch (error) {
        res.status(400).send(error.message);
      }
    });
  });
};

const deleteRoom = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner"], req, res, async () => {
      const { id } = req.query;
      try {
        const room = await Room.findByIdAndDelete(id);
        if (!room) {
          return res.status(404).send("Room not found!");
        }
        res.status(200).send("Room deleted successfully");
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
};
