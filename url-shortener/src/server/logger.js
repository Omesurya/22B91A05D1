
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'access.log');

function logger(req, res, next) {
  const now = new Date();
  const logEntry = `[${now.toISOString()}] ${req.method} ${req.url} IP=${req.ip}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Logging failed');
  });

  next();
}

module.exports = logger;
