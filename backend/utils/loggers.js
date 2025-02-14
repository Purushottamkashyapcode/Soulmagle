// utils/logger.js
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../logs/app.log');

const logger = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  console.log(logMessage);
};

export default logger;
