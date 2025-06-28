import { useState } from 'react';
import axios from 'axios';
import {
  Card, TextField, Button, Typography,
  Alert, Snackbar, Stack, Box, Divider, Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Shortener() {
  const [urls, setUrls] = useState([{ url: '', custom: '', validity: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (index, key, value) => {
    const updated = [...urls];
    updated[index][key] = value;
    setUrls(updated);
  };

  const validate = (url, custom, validity) => {
    if (!/^https?:\/\/\S+\.\S+/.test(url)) return 'Invalid URL';
    if (custom && !/^[a-zA-Z0-9]{4,10}$/.test(custom)) return 'Invalid shortcode';
    if (validity && (isNaN(validity) || parseInt(validity) <= 0)) return 'Validity must be a positive number';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    const input = urls.filter(e => e.url.trim() !== '');
    if (input.length === 0) return setError('At least one URL is required');

    for (let { url, custom, validity } of input) {
      const err = validate(url, custom, validity);
      if (err) return setError(err);
    }

    try {
      const response = await axios.post('http://localhost:5000/shorten', {
        urls: input.map(({ url, custom, validity }) => ({ originalUrl: url, custom, validity }))
      });
      setResults(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Title */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          🔗 Smart URL Shortener
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Paste long links, customize them, and get trackable short URLs.
        </Typography>
      </Box>

      {/* URL Input Cards */}
      <Stack spacing={3}>
        {urls.map((entry, idx) => (
          <Card
            key={idx}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(to top right, #e3f2fd, #ffffff)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              URL #{idx + 1}
            </Typography>
            <TextField
              fullWidth
              label="Long URL"
              value={entry.url}
              onChange={e => handleChange(idx, 'url', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Custom Code (Optional)"
              value={entry.custom}
              onChange={e => handleChange(idx, 'custom', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Validity (in minutes, optional)"
              value={entry.validity}
              onChange={e => handleChange(idx, 'validity', e.target.value)}
            />
          </Card>
        ))}

        {/* Add & Remove URL Buttons */}
        {urls.length < 5 && (
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => setUrls([...urls, { url: '', custom: '', validity: '' }])}
          >
            ➕ Add Another URL
          </Button>
        )}

        {urls.length > 1 && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="large"
            sx={{ mt: 1 }}
            onClick={() => setUrls(prev => prev.slice(0, -1))}
          >
            ➖ Remove Last URL
          </Button>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
        >
          🚀 Shorten URLs
        </Button>
      </Stack>

      {/* Results */}
      <Box mt={5}>
        {results.map((r, i) => (
          <Alert key={i} severity="success" sx={{ mb: 3, p: 2 }}>
            <Typography fontWeight="bold">✅ Shortened URL #{i + 1}</Typography>
            <Divider sx={{ my: 1 }} />
            <div><strong>Original URL:</strong> {urls[i]?.url}</div>
            <div>
              <strong>Short URL:</strong>{' '}
              <a href={r.short} target="_blank" rel="noreferrer">{r.short}</a>
            </div>
            <div><strong>Expires At:</strong> {new Date(r.expireAt).toLocaleString()}</div>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button size="small" variant="outlined" onClick={() => window.open(r.short, '_blank')}>
                Open Link
              </Button>
              <Button size="small" variant="contained" onClick={() => navigate('/stats')}>
                View Stats
              </Button>
            </Stack>
          </Alert>
        ))}
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
}
