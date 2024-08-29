import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./services/AuthService";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Copyright } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setEmail } from "./slices/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmailState] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await register(username, password, role, email);
      //dispatch(setEmail(email));
      setMessage("Registration successful!");
     /* navigate("/reserve-room", {
        state: { email } // Pass email to ReserveRoom
      });*/
      navigate("/login"); // Redirect to login page on successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
          borderRadius: "16px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: 3,
          padding: "24px",
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{ color: "#333", marginBottom: "24px", textAlign: "center" }}
          >
            Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ width: "100%" }}
          >
            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: "16px" }}
            >
              <InputLabel htmlFor="username">Username</InputLabel>
              <FilledInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>

            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: "16px" }}
            >
              <InputLabel htmlFor="email">Email</InputLabel>
              <FilledInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmailState(e.target.value)}
                required
              />
            </FormControl>

            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: "16px" }}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <FilledInput
                id="password"
                type={showPassword ? 'text' : 'password'}
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

            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: "16px" }}
            >
              <InputLabel htmlFor="confirmPassword">
                Confirm Password
              </InputLabel>
              <FilledInput
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl
              fullWidth
              variant="filled"
              sx={{ marginBottom: "32px" }}
            >
              <InputLabel htmlFor="role">Role</InputLabel>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {message && (
              <Typography color="success.main" sx={{ marginBottom: "16px" }}>
                {message}
              </Typography>
            )}
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
                  backgroundColor: "#333",
                },
              }}
            >
              Sign Up
            </Button>

            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
              <Grid item xs>
                <Typography variant="body2">
                  <a
                    href="/login"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    Already have an account? Sign In
                  </a>
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

export default Register;
