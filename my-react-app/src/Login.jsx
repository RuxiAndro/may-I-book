import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./services/AuthService";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Copyright } from "@mui/icons-material"; // Asigură-te că ai această componentă sau implementează-o
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const GlobalStyles = `
  html, body {
    height: 100%;
    margin: 0;
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { role } = await login(username, password);
      console.log("Role:", role);
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        navigate("/owner");
      } else if (role === "client") {
        navigate("/search-room");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
//backgroundImage: "url('/path/to/your/background-image.jpg')", // Înlocuiește cu calea către imaginea ta
  return (
    <Box
        sx={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFA500", 
            padding: "16px",
        }}
    >
      <Card
        sx={{
          borderRadius: "50px", 
          maxWidth: "500px",
          width: "100%",
          boxShadow: 3, 
          padding: "24px",
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            sx={{ color: "#B0B0B0", marginBottom: "16px", fontSize: "1.5rem" }}
          >
            Welcome Back!
          </Typography>

          <Box sx={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
            <AccountCircleIcon sx={{ fontSize: 80, color: "#B0B0B0" }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ width: "100%" }}
          >
            <FormControl fullWidth variant="filled" sx={{ marginBottom: "16px" }}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <FilledInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>

            <FormControl fullWidth variant="filled" sx={{ marginBottom: "32px" }}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <FilledInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {error && (
              <Typography color="error" sx={{ marginBottom: "16px" }}>
                {error}
              </Typography>
            )}
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
            >
              Sign In
            </Button>

            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2" sx={{ color: 'black' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {"Don't have an account? "}
                  <Link 
                    href="/register" 
                    sx={{ color: 'blue', textDecoration: 'none' }} // Setează culoarea textului la albastru
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 5 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                <Copyright sx={{ mr: 1 }} />
                {new Date().getFullYear()} Andro Ruxandra
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
