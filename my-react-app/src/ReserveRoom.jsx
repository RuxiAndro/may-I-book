import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Container, Typography, Box, TextField, Paper, Divider } from "@mui/material";
import { addReservation } from "./slices/reservationSlice";
import { getAuthToken } from "./services/AuthService";
//import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

function ReserveRoom() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { roomId, checkInDate, checkOutDate, guests } = location.state;
  const [userName, setUserName] = useState("");
  const [totalCost, setTotalCost] = useState(null);
  const [previousReservations, setPreviousReservations] = useState([]);
  //const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

 // console.log('Emailllllll:', email);

  const handleReserve = async () => {
    const token = getAuthToken();

   /* if (!email) {
        alert("User email is required. Please ensure you are logged in.");
        return;
    }*/

    const reservation = {
      room: roomId,
      startDate: checkInDate,
      endDate: checkOutDate,
      userName,
      //userEmail:email,
    };

    try {
      const response = await fetch("https://localhost:3001/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservation),
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          dispatch(addReservation(data));
          setTotalCost(data.totalCost);
          alert(`Room ${roomId} booked successfully. Total Cost: $${data.totalCost}`);
        } else {
          alert(`Failed to reserve the room: ${data.message}`);
        }
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error reserving the room");
    }
  };

  const fetchPreviousReservations = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `https://localhost:3001/reservations/${userName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreviousReservations(data);
      } else {
        alert("Failed to retrieve previous reservations");
      }
    } catch (error) {
      console.error("Error fetching previous reservations:", error);
      alert("Error fetching previous reservations");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/home"); 
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Confirm Reservation
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box>
          <Typography variant="h6">Room ID: {roomId}</Typography>
          <Typography variant="h6">Check-In Date: {checkInDate}</Typography>
          <Typography variant="h6">Check-Out Date: {checkOutDate}</Typography>
          <Typography variant="h6">Number of Guests: {guests}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Cost: ${totalCost !== null ? totalCost : "Calculating..."}
          </Typography>

          <TextField
            fullWidth
            label="Your Name"
            variant="outlined"
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#000000', 
                color: '#ffffff', 
                '&:hover': {
                  backgroundColor: '#333333', 
                },
              }}
            onClick={handleReserve}
          >
            Reserve
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{
                mt: 2,
                mb: 2,
                borderColor: '#ff9800', 
                color: '#ff9800', 
                '&:hover': {
                  borderColor: '#e68900',
                  backgroundColor: '#ffe0b2', 
                },
              }}
            onClick={fetchPreviousReservations}
          >
            Show Previous Reservations
          </Button>

          {previousReservations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Previous Reservations:</Typography>
              <Divider sx={{ mb: 2 }} />
              {previousReservations.map((reservation, index) => (
                <Paper key={index} elevation={1} sx={{ padding: 2, mb: 2 }}>
                  <Typography variant="body1">Room ID: {reservation.room}</Typography>
                  <Typography variant="body1">Check-In: {reservation.startDate}</Typography>
                  <Typography variant="body1">Check-Out: {reservation.endDate}</Typography>
                  <Typography variant="body1">Total Cost: ${reservation.totalCost}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                backgroundColor: '#f44336',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        

      </Paper>
    </Container>
  );
}

export default ReserveRoom;
