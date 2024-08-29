const fs = require("fs");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const { Room } = require("./model/Room"); //import modelul Room
const Hotel = require("./model/Hotel");
//const path = require('path');
const cors = require("cors");
const Reservation = require("./model/Reservation");
const authRoutes = require("./authentication");
const resetRoutes = require("./reset-password");
const fetch = require("node-fetch");
const upload = require("./middleware/uploadConfig");


const {
  authenticateJWT,
  authorizeRole,
} = require("./middleware/authMiddleware");

const app = express(); //instanta aplicatiei Express
const port = 3001; // portul pe care serverul Express va asculta, va fi HTTPS

//fisierele certificarte pt https
const key = fs.readFileSync("./certificates/localhost-key.pem");
const cert = fs.readFileSync("./certificates/localhost.pem");

const options = {
  key: key,
  cert: cert,
};

require("dotenv").config();

//conectare la Mongo

mongoose
  .connect("mongodb://localhost:27017/db-for-booking")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

//app.use(cors()); // configurez CORS
app.use(
  cors({
    origin: "https://localhost:5173", // Permite cereri doar din această origine, aici ruleaza momentan frontendul aplicatiei
    methods: ["GET", "POST", "PUT", "DELETE"], // Specifică metodele HTTP permise
    allowedHeaders: ["Content-Type", "Authorization"], // Specifică tipurile de anteturi permise
  })
);

// Permite cereri OPTIONS pentru toate rutele
app.options("*", cors());

app.use(express.json()); // asta permite serverului sa inteleaga si sa proceseze cererile HTTP care contin JSON in corpul lor

app.use("/auth", authRoutes); //foloseste rutele de autentificare
app.use("/reset", resetRoutes);
//CRUD pt rooms
//endpoint pt crearea unei camere
/*app.post('/rooms',authenticateJWT,authorizeRole(['owner']),async(req,res) => {
   // const RoomModel=Room.getModel();//obtin modelul pt colectia rooms
    const newRoom = new Room(req.body);
    try{
        await newRoom.save(); //aici se salveaza in DB
        //folosesc await pt a astepta ca operatia de salvare sa fie completa 
        res.status(201).send(newRoom); //201=created
    }catch (error){
        res.status(400).send(error);
    }
});*/

app.use("/uploads", express.static("uploads"));

app.post(
  "/rooms",
  authenticateJWT,
  authorizeRole(["owner"]),
  async (req, res) => {
    const {
      number,
      pricePerNight,
      type,
      capacity,
      availabilityStartDate,
      availabilityEndDate,
      imagePath,
    } = req.body;
    try {
      const newRoom = new Room({
        number,
        pricePerNight,
        type,
        capacity,
        availabilityStartDate,
        availabilityEndDate,
        imagePath,
      });
      await newRoom.save();
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

app.get(
  "/allRooms",
  authenticateJWT,
  authorizeRole(["owner", "admin"]),
  async (req, res) => {
    try {
      const room = await Room.find();
      res.status(200).json(room);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.get(
  "/rooms/:id",
  authenticateJWT,
  authorizeRole(["owner", "admin"]),
  async (req, res) => {
    const { id } = req.params; //destructurare

    try {
      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).send("Room not found!");
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.put(
  "/updateRoom/:id",
  authenticateJWT,
  authorizeRole(["owner"]),
  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }); //new returneaza noua versiune a camerei dupa actualizare
      if (!updatedRoom) {
        return res.status(404).send("Room not found!");
      }
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

app.delete(
  "/deleteRoom/:id",
  authenticateJWT,
  authorizeRole(["owner"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findByIdAndDelete(id);
      if (!room) {
        return res.status(404).send("Room not found!");
      }
      res.status(200).send("Room deleted successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.post(
  "/hotels",
  authenticateJWT,
  authorizeRole(["admin"]),
  async (req, res) => {
    const HotelModel = Hotel.getModel(); //obtin modelul pt colectia hotels
    const newHotel = new HotelModel(req.body);
    try {
      await newHotel.save(); //aici se salveaza in DB
      //folosesc await pt a astepta ca operatia de salvare sa fie completa
      res.status(201).send(newHotel); //201=created
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

app.put(
  "/hotels/:id/rooms",
  authenticateJWT,
  authorizeRole(["owner"]),
  async (req, res) => {
    const { id } = req.params; //extrag id ul din param url-ului
    const roomData = req.body; //datele camerei le iau din corpul cererii

    try {
      //console.log(Hotel.getModel());
      const hotel = await Hotel.getModel().findById(id);
      if (!hotel) {
        return res.status(404).send("Hotel not found");
      }

      hotel.rooms.push(roomData);
      hotel.numberOfRooms = hotel.rooms.length; //actualizez nr de camere a hotelului
      await hotel.save();
      res.status(201).send(hotel);
    } catch (error) {
      res.status(400);
    }
  }
);

app.get(
  "/hotels/:id/rooms",
  authenticateJWT,
  authorizeRole(["owner", "admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const hotel = await Hotel.getModel().findById(id).populate("rooms");

      if (!hotel) {
        return res.status(404).send("Hotel not found");
      }

      res.status(200).json(hotel.rooms);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.post(
  "/reservations",
  authenticateJWT,
  authorizeRole(["owner", "admin", "client"]),
  async (req, res) => {
    //console.log('Received reservation data:', req.body);
    const { room, startDate, endDate, userName } = req.body;

    /*  if (!userEmail) {
      return res.status(400).send("User email is required for reservation confirmation");
    }*/
    //console.log("lkjhgfdsasdfghj");
    console.log("Room ID:", room);

    try {
      const start = new Date(startDate); //ex  2023-08-01T00:00:00.000Z
      const end = new Date(endDate);
      console.log("Parsed Dates:", { start, end });

      if (end <= start) {
        return res.status(400).send("End date must be after start date");
      }

      // Verifică disponibilitatea camerei
      const overlappingReservations = await Reservation.find({
        room: room,
        startDate: { $lt: end },
        endDate: { $gt: start },
      });

      if (overlappingReservations.length > 0) {
        return res
          .status(400)
          .send("Room is not available for the selected dates");
      }

      console.log(Room);
      console.log(typeof Room.findById);
      // Obține detaliile camerei pentru a calcula costul total
      const roomDetails = await Room.findById(room);

      console.log(roomDetails);
      if (!roomDetails) {
        return res.status(404).send("Room not found");
      }

      const nights = (end - start) / (1000 * 60 * 60 * 24);
      // console.log(roomDetails.endDate);
      const totalCost = nights * roomDetails.pricePerNight;
      console.log(nights);
      console.log(totalCost);
      // Creeaza rezervarea
      const newReservation = new Reservation({
        room,
        startDate,
        endDate,
        userName,
        totalCost,
      });

      await newReservation.save();

      /*  const confirmReservationResponse = await fetch(`http://localhost:3001/reset/confirm-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          reservationDetails: {
            roomId: room,
            checkInDate: startDate,
            checkOutDate: endDate,
            guests,
            totalCost,
          },
        }),
      });

      if (!confirmReservationResponse.ok) {
        throw new Error('Failed to send confirmation email');
      }*/

      res.status(201).send(newReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).send(error.message);
    }
  }
);

app.post("/availability/rooms", async (req, res) => {
  const { checkInDate, checkOutDate, guests } = req.body;

  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const availableRooms = await Room.find({
      availabilityStartDate: { $lte: checkIn },
      availabilityEndDate: { $gte: checkOut },
      _id: {
        $nin: await Reservation.distinct("room", {
          startDate: { $lt: checkOut },
          endDate: { $gt: checkIn },
        }),
      },
      capacity: { $gte: guests },
    });

    if (availableRooms.length === 0) {
      return res
        .status(404)
        .send("No available rooms found for the given dates");
    }

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    // res.status(500).send('Server error');
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Heiiiii!");
});

app.get("/reservations/:userName", authenticateJWT, async (req, res) => {
  const userName = req.params.userName;
  try {
    const reservations = await Reservation.find({ userName: userName });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reservations" });
  }
});
/*app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});*/

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

app.post(
  "/upload",
  authenticateJWT,
  authorizeRole(["owner"]),
  upload.single("image"),
  (req, res) => {
    try {
      res.status(200).json({ imagePath: `/uploads/${req.file.filename}` });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);


/* doar de testare
// Servirea fișierelor statice produse de Vite
app.use(express.static(path.join(__dirname, '../my-react-app/dist')));

// Route pentru API
app.get('/api/greeting', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// Catch-all route pentru frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-react-app/dist/index.html'));
});
//Asteriscul (*) acționează ca un wildcard, potrivindu-se cu orice rută.

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//Pornește serverul Express și îl face să asculte pe portul specificat (în acest caz, 3000)
*/
