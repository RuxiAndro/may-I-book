import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  FilledInput,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search"; // Iconă opțională
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Iconă opțională

function SearchRoom() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/available-rooms", {
      state: { checkInDate, checkOutDate, guests },
    });
  };

  const handleCheckInDateChange = (e) => {
    const selectedCheckInDate = e.target.value;
    setCheckInDate(selectedCheckInDate);

    if (
      checkOutDate &&
      new Date(checkOutDate) <= new Date(selectedCheckInDate)
    ) {
      setCheckOutDate("");
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "120%",
        maxWidth: "1200px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFA500",
        padding: "16px",
        margin: "0 auto", // centrare pe orizontala
      }}
    >
      <Card
        sx={{
          borderRadius: "50px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: 3,
          padding: "24px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            sx={{
              color: "#B0B0B0",
              marginBottom: "16px",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            Search for Rooms
          </Typography>

          <Box
            sx={{
              marginBottom: "32px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SearchIcon sx={{ fontSize: 80, color: "#B0B0B0" }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormControl variant="filled" sx={{ marginBottom: "16px" }}>
              <InputLabel htmlFor="checkInDate">Check-In Date</InputLabel>
              <FilledInput
                id="checkInDate"
                type="date"
                value={checkInDate}
                onChange={handleCheckInDateChange}
                required
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  paddingY: "12px",
                }}
                inputProps={{ sx: { color: "black" } }}
              />
            </FormControl>

            <FormControl variant="filled" sx={{ marginBottom: "16px" }}>
              <InputLabel htmlFor="checkOutDate">Check-Out Date</InputLabel>
              <FilledInput
                id="checkOutDate"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                inputProps={{ 
                    min: checkInDate || new Date().toISOString().split("T")[0],
                    sx: { color: "black" } 
                  }}
              
                required
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  paddingY: "12px",
                }}
               
              />
            </FormControl>

            <FormControl variant="filled" sx={{ marginBottom: "32px" }}>
              <InputLabel htmlFor="guests">Number of Persons</InputLabel>
              <FilledInput
                id="guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  paddingY: "12px",
                }}
                inputProps={{ min: 1, sx: { color: "black" } }}
              />
            </FormControl>

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
                  backgroundColor: "#333",
                },
                alignSelf: "center",
              }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SearchRoom;
