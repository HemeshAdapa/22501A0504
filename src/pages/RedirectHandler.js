import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

// Dummy mapping for demonstration; replace with real lookup in production
const dummyUrlMap = {
  abc123: 'https://example.com',
  // Add more mappings as needed
};

export default function RedirectHandler() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API lookup and redirection
    const timer = setTimeout(() => {
      const url = dummyUrlMap[code];
      if (url) {
        window.location.href = url;
      } else {
        setError('Short URL not found or expired.');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [code]);

  if (error) {
    return (
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Typography>
          <a href="/" onClick={() => navigate('/')}>Go to Home</a>
        </Typography>
      </Box>
    );
  }

  return (
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
      </Box>
    );
  }