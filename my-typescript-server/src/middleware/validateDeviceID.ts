import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { readCsv } from '../utils/csvUtils';

const devicesCsvPath = path.resolve(__dirname, '../../data/devices.csv'); // Pastikan path ini benar

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({ message: 'API Key is missing' });
    }

    // Baca data devices dari CSV
    const devices = await readCsv(devicesCsvPath);

    // Validasi apakah API Key ada di daftar devices
    const isValid = devices.some((device) => device.apiKey === apiKey);

    if (!isValid) {
      return res.status(403).json({ message: 'Invalid API Key' });
    }

    next();
  } catch (error) {
    console.error('Error in validateApiKey middleware:', error);
    res.status(500).json({ message: 'Server error during API key validation', error: error });
  }
};
