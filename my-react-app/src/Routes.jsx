import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import About from './About';
import App from './App';
import Client from './ClientPage';
import Admin from './Admin';
import Room from './Room';
import Hotel from './Hotel';
import SearchRoom from './SearchRoom';
import AvailableRooms from './AvailableRooms';
import ReserveRoom from './ReserveRoom';
import Register from './Register';
import Login from './Login';
import Owner from './Owner';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import AvailableRoomsOnlyRead from './AvailableRoomsOnlyRead';

function Navigation(){
    const location=useLocation();//hook care obtine ruta curenta
    if(location.pathname!=='/Home')
    {
        return null;
    }
    return(
        <nav>
        <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/app">App</Link>
            </li>
            <li>
              <Link to="/">Client</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
           
            <li>
              <Link to="/hotel">Hotel</Link>
            </li>
        </ul>
     </nav>
    );
}

function AppRoutes() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/app" element={<App />} />
          <Route path='/home'element={<Home />} />
          <Route path='/admin'element={<Admin />} />
          <Route path='/room'element={<Room />} />
          <Route path='/hotel'element={<Hotel />} />
          <Route path='/search-room'element={<SearchRoom />} />
          <Route path="/available-rooms" element={<AvailableRooms />} />
          <Route path="/reserve-room" element={<ReserveRoom />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/owner'element={<Owner />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/forgot-password'element={<ForgotPassword />} />
          <Route path='/available-rooms-only-read'element={<AvailableRoomsOnlyRead />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRoutes;
// <Route path='/room/:hotelId'element={<Room />} />