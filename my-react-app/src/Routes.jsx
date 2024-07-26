import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import About from './About';
import App from './App';
import Client from './ClientPage';
import Admin from './Admin';

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
          <Route path="/" element={<Client />} />
          <Route path="/about" element={<About />} />
          <Route path="/app" element={<App />} />
          <Route path='/home'element={<Home />} />
          <Route path='/admin'element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRoutes;
