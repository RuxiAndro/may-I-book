import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItem, Button, Box, Paper, Divider } from "@mui/material";

function Admin() {
  const reservations = useSelector((state) => state.reservations); // Access state from store
  const navigate = useNavigate();

  const handleAddHotelClick = () => {
    navigate('/hotel');
  };

  const handleRoomClick = () => {
    navigate('/room');
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/home");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reservation List
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <List>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <ListItem key={reservation._id}>
                {`ID: ${reservation._id || 'N/A'}, Start Date: ${formatDate(reservation.startDate) || 'N/A'}, End Date: ${formatDate(reservation.endDate) || 'N/A'}, User: ${reservation.userName || 'N/A'}, Total Cost: ${reservation.totalCost || 'N/A'}`}
              </ListItem>
            ))
          ) : (
            <ListItem>No reservations found</ListItem>
          )}
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: '#1976d2', color: '#ffffff', '&:hover': { backgroundColor: '#1565c0' } }}
            onClick={handleAddHotelClick}
          >
            Add Hotel
          </Button>

          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: '#f50057', color: '#ffffff', '&:hover': { backgroundColor: '#c51162' } }}
            onClick={handleRoomClick}
          >
            View Rooms
          </Button>
          
          <Button
            variant="contained"
            color="error"
            sx={{ backgroundColor: '#f44336', color: '#ffffff', '&:hover': { backgroundColor: '#d32f2f' } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        
        
      </Paper>
    </Container>
  );
}

export default Admin;
