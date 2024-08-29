import React, { useState } from 'react';
import { Box, FormControl, InputLabel, FilledInput, Button, Typography } from '@mui/material';
import { forgotPassword } from './services/AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage('Password reset email sent');
    } catch (err) {
      setError(err.message);
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
        padding: '16px',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: '400px',
          width: '100%',
          padding: '24px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '16px' }}>
          Forgot Your Password
        </Typography>
        <FormControl fullWidth variant="filled" sx={{ marginBottom: '16px' }}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <FilledInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        {message && <Typography color="success.main" sx={{ marginBottom: '16px' }}>{message}</Typography>}
        {error && <Typography color="error" sx={{ marginBottom: '16px' }}>{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: '50px',
            padding: '10px 40px',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Send Reset Link
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
