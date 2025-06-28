import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Dummy data for demonstration
const dummyStats = [
  {
    originalUrl: 'https://example.com',
    shortUrl: `${window.location.origin}/short/abc123`,
    createdAt: '2024-06-28 10:00:00',
    expiresAt: '2024-06-28 10:30:00',
    totalClicks: 3,
    clicks: [
      {
        timestamp: '2024-06-28 10:05:00',
        source: 'Chrome on Windows',
        location: 'India',
      },
      {
        timestamp: '2024-06-28 10:10:00',
        source: 'Firefox on Linux',
        location: 'USA',
      },
      {
        timestamp: '2024-06-28 10:15:00',
        source: 'Safari on iOS',
        location: 'UK',
      },
    ],
  },
  // Add more dummy URLs if needed
];

function ClickDetails({ clicks }) {
  return (
    <Table size="small" sx={{ mt: 1 }}>
      <TableHead>
        <TableRow>
          <TableCell>Timestamp</TableCell>
          <TableCell>Source</TableCell>
          <TableCell>Location</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {clicks.map((click, idx) => (
          <TableRow key={idx}>
            <TableCell>{click.timestamp}</TableCell>
            <TableCell>{click.source}</TableCell>
            <TableCell>{click.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function StatisticsPage() {
  const [openRows, setOpenRows] = useState({});

  const handleToggleRow = (idx) => {
    setOpenRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // In a real app, fetch stats from backend or local storage here

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {dummyStats.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {dummyStats.map((stat, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleRow(idx)}
                      aria-label="expand row"
                    >
                      {openRows[idx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </Grid>
                  <Grid item xs>
                    <Typography>
                      <strong>Original URL:</strong> {stat.originalUrl}
                    </Typography>
                    <Typography>
                      <strong>Short URL:</strong>{' '}
                      <a href={stat.shortUrl} target="_blank" rel="noopener noreferrer">
                        {stat.shortUrl}
                      </a>
                    </Typography>
                    <Typography>
                      <strong>Created At:</strong> {stat.createdAt}
                    </Typography>
                    <Typography>
                      <strong>Expires At:</strong> {stat.expiresAt}
                    </Typography>
                    <Typography>
                      <strong>Total Clicks:</strong> {stat.totalClicks}
                    </Typography>
                  </Grid>
                </Grid>
                <Collapse in={openRows[idx]} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Click Details</Typography>
                    <ClickDetails clicks={stat.clicks} />
                  </Box>
                </Collapse>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}