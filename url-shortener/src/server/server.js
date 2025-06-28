// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const geoip = require('geoip-lite');
const logger = require('./logger');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// In-memory DB
const urlMap = {};
const statsMap = {};

// Helper
const isValidURL = (url) => /^https?:\/\/\S+\.\S+/.test(url);
const generateCode = () => Math.random().toString(36).substr(2, 6);

app.post('/shorten', (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls)) return res.status(400).json({ message: 'Invalid input' });

  const results = [];

  for (let item of urls) {
    let { originalUrl, custom, validity } = item;
    if (!isValidURL(originalUrl)) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    let code = custom?.trim();
    if (code) {
      if (!/^[a-zA-Z0-9]{4,10}$/.test(code)) return res.status(400).json({ message: 'Invalid custom code' });
      if (urlMap[code]) return res.status(400).json({ message: `Code "${code}" already in use` });
    } else {
      do {
        code = generateCode();
      } while (urlMap[code]);
    }

    const now = Date.now();
    const expireAt = now + (parseInt(validity) > 0 ? parseInt(validity) : 30) * 60000;

    urlMap[code] = { url: originalUrl, createdAt: now, expireAt };
    statsMap[code] = { url: originalUrl, clicks: [], createdAt: now, expireAt };

    results.push({
      short: `http://localhost:3000/${code}`,
      expireAt
    });
  }

  res.json(results);
});

app.get('/expand/:code', (req, res) => {
  const code = req.params.code;
  const entry = urlMap[code];

  if (!entry) return res.status(404).json({ message: 'Code not found' });
  if (Date.now() > entry.expireAt) return res.status(410).json({ message: 'Link expired' });

  // Logging click
  const referrer = req.headers.referer || 'Direct';
  const geo = geoip.lookup(req.ip) || {};
  statsMap[code].clicks.push({
    timestamp: new Date(),
    referrer,
    location: geo.city || geo.country || 'Unknown'
  });

  res.json({ url: entry.url });
});

app.get('/stats', (req, res) => {
  res.json(statsMap);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
