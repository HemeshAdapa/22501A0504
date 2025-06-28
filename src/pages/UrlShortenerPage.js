import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DEFAULT_VALIDITY = 30; // minutes

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{3,20}$/.test(code);
}

const emptyUrlObj = { url: '', validity: '', shortcode: '', error: '' };

export default function UrlShortenerPage() {
  const [inputs, setInputs] = useState([
    { ...emptyUrlObj },
  ]);
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    newInputs[idx].error = '';
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs([...inputs, { ...emptyUrlObj }]);
  };

  const removeInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const validateInputs = () => {
    let valid = true;
    const newInputs = inputs.map((input) => {
      let error = '';
      if (!input.url || !isValidUrl(input.url)) {
        error = 'Enter a valid URL.';
        valid = false;
      } else if (input.validity && (!/^\d+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
        error = 'Validity must be a positive integer.';
        valid = false;
      } else if (input.shortcode && !isValidShortcode(input.shortcode)) {
        error = 'Shortcode must be 3-20 alphanumeric chars.';
        valid = false;
      }
      return { ...input, error };
    });
    setInputs(newInputs);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setSubmitting(true);
    setResults([]);
    try {
      // Simulate API call
      const response = await Promise.all(
        inputs.map(async (input) => {
          // Replace this with your actual API call
          const code = input.shortcode || Math.random().toString(36).substring(2, 8);
          const now = new Date();
          const validity = input.validity ? parseInt(input.validity) : DEFAULT_VALIDITY;
          const expiry = new Date(now.getTime() + validity * 60000);
          return {
            originalUrl: input.url,
            shortUrl: `${window.location.origin}/short/${code}`,
            createdAt: now.toLocaleString(),
            expiresAt: expiry.toLocaleString(),
            shortcode: code,
          };
        })
      );
      setResults(response);
    } catch (err) {
      // Handle error
      alert('An error occurred while shortening URLs.');
    }
    setSubmitting(false);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shorten up to 5 URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {inputs.map((input, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Original URL"
                      fullWidth
                      value={input.url}
                      onChange={(e) => handleInputChange(idx, 'url', e.target.value)}
                      error={!!input.error}
                      helperText={input.error}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Validity (min)"
                      type="number"
                      fullWidth
                      value={input.validity}
                      onChange={(e) => handleInputChange(idx, 'validity', e.target.value)}
                      placeholder={DEFAULT_VALIDITY}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Preferred Shortcode"
                      fullWidth
                      value={input.shortcode}
                      onChange={(e) => handleInputChange(idx, 'shortcode', e.target.value)}
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    {inputs.length > 1 && (
                      <Button
                        color="error"
                        onClick={() => removeInput(idx)}
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={addInput}
            disabled={inputs.length >= 5}
            sx={{ mr: 2 }}
          >
            Add URL
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            Shorten
          </Button>
        </Box>
      </form>

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Shortened URLs
          </Typography>
          {results.map((res, idx) => (
            <Paper sx={{ p: 2, mb: 2 }} key={idx}>
              <Typography>
                <strong>Original URL:</strong> {res.originalUrl}
              </Typography>
              <Typography>
                <strong>Short URL:</strong>{' '}
                <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">
                  {res.shortUrl}
                </a>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(res.shortUrl)}
                  sx={{ ml: 1 }}
                  aria-label="Copy short URL"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Typography>
              <Typography>
                <strong>Created At:</strong> {res.createdAt}
              </Typography>
              <Typography>
                <strong>Expires At:</strong> {res.expiresAt}
              </Typography>
              <Typography>
                <strong>Shortcode:</strong> {res.shortcode}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}