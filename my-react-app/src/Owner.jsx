import React, { useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Owner() {
  const reservations = useSelector((state) => state.reservations);
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    number: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    availabilityStartDate: "",
    availabilityEndDate: "",
    imagePath: "",
  });
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleRoomClick = () => {
    navigate("/room");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/home"); 
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    let imagePath = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadResponse = await fetch("https://localhost:3001/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        imagePath = data.imagePath;
        setRoom((prevRoom) => ({
          ...prevRoom,
          imagePath: imagePath,
        }));
      } else {
        setMessage("Failed to upload image");
        return;
      }
    }

    const roomData = { ...room, imagePath };

    const response = await fetch("https://localhost:3001/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(roomData),
    });

    if (response.ok) {
      setMessage("Room added successfully!");
      setRoom({
        number: "",
        type: "",
        pricePerNight: "",
        capacity: "",
        availabilityStartDate: "",
        availabilityEndDate: "",
        imagePath: "",
      });
      setImageFile(null);
    } else {
      setMessage("Failed to add room");
    }
  };

  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reservation List
      </Typography>

      <List>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <ListItem key={reservation._id}>
              {`ID: ${reservation._id || "N/A"}, Start Date: ${
                formatDate(reservation.startDate) || "N/A"
              }, End Date: ${formatDate(reservation.endDate) || "N/A"}, User: ${
                reservation.userName || "N/A"
              }, Total Cost: ${reservation.totalCost || "N/A"}`}
            </ListItem>
          ))
        ) : (
          <ListItem>No reservations found</ListItem>
        )}
      </List>

      <Box mt={4}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add a New Room
        </Typography>
        <form onSubmit={handleRoomSubmit}>
          <Stack spacing={2}>
            <TextField
              name="number"
              label="Room Number"
              value={room.number}
              onChange={handleRoomChange}
              fullWidth
              required
            />
            <TextField
              name="type"
              label="Room Type"
              value={room.type}
              onChange={handleRoomChange}
              fullWidth
              required
            />
            <TextField
              name="pricePerNight"
              label="Price Per Night"
              value={room.pricePerNight}
              onChange={handleRoomChange}
              fullWidth
              required
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              name="capacity"
              label="Capacity"
              value={room.capacity}
              onChange={handleRoomChange}
              fullWidth
              required
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              name="availabilityStartDate"
              label="Availability Start Date"
              type="date"
              value={room.availabilityStartDate}
              onChange={handleRoomChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="availabilityEndDate"
              label="Availability End Date"
              type="date"
              value={room.availabilityEndDate}
              onChange={handleRoomChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

<Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                backgroundColor: 'orange',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ffb74d', 
                },
              }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0', 
                },
              }}
            >
              Add Room
            </Button>
            {message && <Typography color="error">{message}</Typography>}
          </Stack>
        </form>
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRoomClick}
          fullWidth
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          View Rooms
        </Button>
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          fullWidth
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b71c1c', 
            },
          }}
        >
          Logout
        </Button>
      </Box>

    </Container>
  );
}

export default Owner;
