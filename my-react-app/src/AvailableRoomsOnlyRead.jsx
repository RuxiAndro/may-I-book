import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function AvailableRoomsOnlyRead() {
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

  const handleLogin = () => {
    navigate("/login"); 
  };

  return (
    <Box
      style={{
        backgroundImage:
          "url(https://www.google.com/search?sca_esv=20ef6b07cd0fcad8&sxsrf=ADLYWILPpjL9-s-a_MEErmgTrcQcJ-9iEw:1724763464232&q=background+for+a+website+with+orange&udm=2&fbs=AEQNm0AuaLfhdrtx2b9ODfK0pnmis1zS4enB7jefi_fubH5nzzN3wC83IX-0M5Kltd9aV1o0JXTYTVfdC2TJa4MIjELFSgp7CK3907CsUP8CSuaC3g1Aa9nqi1UmFRpK9kdDJCHthsNiWpBWSLD0_yy-X27lw7EY3-vH951uj-a3Bvk-JadYOTli1UX-eP5lUHonUNxk2np9&sa=X&ved=2ahUKEwjnoe3MnJWIAxV2iv0HHSthEMYQtKgLegQIDBAB&biw=751&bih=874&dpr=2#vhid=RHPRjlwciRxB_M&vssid=mosaic)", // Înlocuiește cu URL-ul imaginii tale
        backgroundSize: "cover",
        backgroundColor: "#FFA500",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Available Rooms
        </Typography>

        <List>
          {rooms.map((room) => (
            <Card key={room.number} style={{ marginBottom: "1rem" }}>
              <CardContent>
                <Typography variant="h6">
                  Room {room.number} - {room.type}
                </Typography>
                <Typography color="textSecondary">
                  Price: ${room.pricePerNight} per night
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>

        <Box mb={4} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            If you want to reserve a room, please log in to your account.
          </Typography>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: "50px",
              padding: "10px 40px",
              marginTop: "16px",
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333", // culoare de fundal la hover
              },
            }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AvailableRoomsOnlyRead;
