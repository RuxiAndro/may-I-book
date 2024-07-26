import { Container, Typography, List, ListItem } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function Admin(){
    const reservations=useSelector((state) => state.reservations); //accesez starea din store

    return(
      <Container maxWidth="sm">

        <Typography variant="h4" component="h1" gutterBottom> 
            Reservation List
        </Typography>
        
        <List>
            {
                reservations.map((reservation) => 
                (<ListItem key={reservation.id}>
                     {`ID: ${reservation.id}, Check-In: ${reservation.checkInDate}, Check-Out: ${reservation.checkOutDate}, Guests: ${reservation.guests}`}
                </ListItem>
                ))
            }
        </List>
      </Container>

    );
}

export default Admin;