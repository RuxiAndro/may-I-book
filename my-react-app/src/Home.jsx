import React, { useState } from 'react';
import './Home.css'
import { AppBar, Toolbar,Typography,Button,Box,Container,TextField} from '@mui/material';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Home(){
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guests, setGuests] = useState(1);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/available-rooms-only-read', { state: { checkInDate, checkOutDate, guests } });
    };

    const handleCheckInDateChange = (e) => {
        const selectedCheckInDate = e.target.value;
        setCheckInDate(selectedCheckInDate);

        if (checkOutDate && new Date(checkOutDate) <= new Date(selectedCheckInDate)) {
            setCheckOutDate("");
        }
    };

    return(
        <div>

            <AppBar position="fixed" sx={{ backgroundColor: '#FF9800' }}>
                <Toolbar >

                <Typography variant="h6">
                    Just Book
                </Typography>

                <Box sx={{ml:'auto'}}>
                <Button color="inherit">
                    <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Login
                    </Link>
                </Button>

                <Button color="inherit">
                    <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Sign In
                    </Link>
                </Button>
                </Box>

                </Toolbar>
            </AppBar>

            <div style={{ marginTop: '64px' }}> {}
                <h1 className='homePage'>Home Page</h1>
                <p className='welcome'>Welcome to the Home Page!</p>
            </div>

            <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom> 
                Search Available Rooms
            </Typography>
            <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="checkInDate"
                    label="Check-In Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={checkInDate}
                    onChange={handleCheckInDateChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="checkOutDate"
                    label="Check-Out Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                        inputProps={{ min: checkInDate || new Date().toISOString().split("T")[0] }}
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
                    sx={{ mt: 3, mb: 2, backgroundColor: '#FF9800',"&:hover": {
                  backgroundColor: "#FF8800", 
                },}}
                >
                    Search
                </Button>
            </Box>
        </Container>


        </div>
    );
}

export default Home;