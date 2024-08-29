const mongoose = require("mongoose");
const { Reservation } = require("../model/Reservation");
const { Room } = require("../model/Room");
const { authenticateJWT, authorizeRole } = require("../middleware/authMiddleware");

mongoose.connect("mongodb://localhost:27017/db-for-booking")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = async (req, res) => {
  if (req.method === "POST") {
    await createReservation(req, res);
  } else if (req.method === "GET") {
    await getReservationsByUser(req, res);
  } else {
    res.status(405).end();
  }
};

const createReservation = async (req, res) => {
  authenticateJWT(req, res, async () => {
    authorizeRole(["owner", "admin", "client"], req, res, async () => {
      const { room, startDate, endDate, userName } = req.body;
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
          return res.status(400).send("End date must be after start date");
        }

        const overlappingReservations = await Reservation.find({
          room: room,
          startDate: { $lt: end },
          endDate: { $gt: start },
        });

        if (overlappingReservations.length > 0) {
          return res.status(400).send("Room is not available for the selected dates");
        }

        const roomDetails = await Room.findById(room);
        if (!roomDetails) {
          return res.status(404).send("Room not found");
        }

        const nights = (end - start) / (1000 * 60 * 60 * 24);
        const totalCost = nights * roomDetails.pricePerNight;

        const newReservation = new Reservation({
          room,
          startDate,
          endDate,
          userName,
          totalCost,
        });

        await newReservation.save();
        res.status(201).json(newReservation);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
};

const getReservationsByUser = async (req, res) => {
  authenticateJWT(req, res, async () => {
    const userName = req.query.userName;
    try {
      const reservations = await Reservation.find({ userName });
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).send("Error retrieving reservations");
    }
  });
};
