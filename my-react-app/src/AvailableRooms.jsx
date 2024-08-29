import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function AvailableRooms() {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkInDate, checkOutDate, guests } = location.state;
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("https://localhost:3001/availability/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkInDate, checkOutDate, guests }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, [checkInDate, checkOutDate, guests]);

  const handleSelectRoom = (roomId) => {
    navigate("/reserve-room", {
      state: { roomId, checkInDate, checkOutDate, guests },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "24px",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ color: "#333", marginBottom: "32px" }}
        >
          Available Rooms
        </Typography>
        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://localhost:3001${room.imagePath}`} 
                  alt={`Room ${room.number}`}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Room {room.number} - {room.type}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: "16px" }}
                  >
                    Price: ${room.pricePerNight} per night
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSelectRoom(room._id)}
                    sx={{
                      backgroundColor: "#FFA500",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#FFA700",
                      },
                    }}
                  >
                    Reserve
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default AvailableRooms;
