import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, FormControl, InputLabel, FilledInput, InputAdornment, IconButton, Button, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch(`https://localhost:3001/reset/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
  
      if (response.ok) {
        setMessage('Password has been reset successfully!');
        navigate('/login'); 
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while resetting the password');
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFA500',
        padding: '16px',
      }}
    >
      <Box
        component="form"
        onSubmit={handleResetPassword}
        sx={{
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: 3,
          padding: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: '#333', marginBottom: '24px', textAlign: 'center' }}
        >
          Reset Password
        </Typography>

        <FormControl fullWidth variant="filled" sx={{ marginBottom: '16px' }}>
          <InputLabel htmlFor="password">New Password</InputLabel>
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

        <FormControl fullWidth variant="filled" sx={{ marginBottom: '16px' }}>
          <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
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

        {message && (
          <Typography color="success.main" sx={{ marginBottom: '16px' }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ marginBottom: '16px' }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: '50px',
            padding: '10px 40px',
            marginTop: '16px',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
