// Stats.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Paper, TableContainer,
  Box
} from '@mui/material';

export default function Stats() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/stats').then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <Box className="container">
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
        📊 URL Usage Statistics
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ color: '#555' }}>
        Detailed information about shortened URLs and their performance.
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Short Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Original URL</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expires</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ padding: 4 }}>
                  No stats available yet.
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(data).map(([code, entry]) => (
                <TableRow key={code} hover>
                  <TableCell>{code}</TableCell>
                  <TableCell>
                    <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.url}</a>
                  </TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(entry.expireAt).toLocaleString()}</TableCell>
                  <TableCell>{entry.clicks.length}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
