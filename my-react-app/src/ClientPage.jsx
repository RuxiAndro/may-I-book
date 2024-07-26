import React, {useState} from "react";
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useDispatch } from "react-redux";
import { addResevation } from "./slices/reservationSlice";

function Client()
{
    const [checkInDate,setCheckInDate]=useState("");
    const [checkOutDate,setCheckOutDate]=useState("");
    const[guests,setGuests]=useState(1);

    const dispatch=useDispatch();
 
    const handleSubmit = (e) => {
        e.preventDefault();//previne reincarcarea paginii atunci cand dau click pe search

        const reservation = { 
          id:Date.now(), //generez un id unic pt rezervare
          checkInDate,
          checkOutDate,
          guests
        };
        console.log('Dispatching reservation:', reservation);
        //functia de actualizare a starii am inlocuit-o cu actiunea de dispatch
        dispatch(addResevation(reservation));//trimit actiunea
        setCheckInDate('');
        setCheckOutDate('');
        setGuests(1);
        alert(`Booked for ${guests} from ${checkInDate} till ${checkOutDate}`);
    };

    return (
    <Container maxWidth="sm">

      <Typography variant="h4" component="h1" gutterBottom> 
        Book now
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
          margin="normal"
          required
          fullWidth
          id="checkInDate"
          label="Check-In Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="checkOutDate"
          label="Check-Out Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="guests"
          label="Number of persons"
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Book
        </Button>
      </Box>
    </Container>
  );
}

export default Client;