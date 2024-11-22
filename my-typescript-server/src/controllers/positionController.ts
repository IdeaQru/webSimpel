import { Request, Response } from 'express';
import { saveOrUpdatePosition, getPositions } from '../services/positionService';
import { readCsv } from '../utils/csvUtils';
import path from 'path';
import fs from 'fs';

// Filepath for devices data
const devicesFilePath = path.join(__dirname, '../../data/devices.csv');

// Retrieve all positions, optionally filtered by `deviceId`
export const getAllPositions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.query; // Ambil `deviceId` dari query parameters (optional)

    // Ambil semua posisi atau posisi berdasarkan `deviceId`
    const positions = await getPositions(deviceId as string);

    // Jika tidak ada data posisi ditemukan
    if (!positions || positions.length === 0) {
      res.status(404).json({ message: 'No position data found' });
      return;
    }

    // Kirim data posisi ke frontend
    res.status(200).json(positions);
  } catch (error) {
    console.error('Error in getAllPositions:', error);
    res.status(500).json({
      message: 'Failed to retrieve position data',
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Retrieve position data by `deviceId`
export const getPositionByDeviceId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.params; // Ambil `deviceId` dari parameter URL

    // Validasi jika `deviceId` tidak ada
    if (!deviceId) {
      res.status(400).json({ message: 'Device ID is missing' });
      return;
    }

    // Path file JSON berdasarkan `deviceId`
    const filePath = path.join(__dirname, '../../data/devices', `${deviceId}.json`);

    // Periksa apakah file JSON ada
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: `Data for deviceId: ${deviceId} not found` });
      return;
    }

    // Baca data dari file JSON
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = fileContent.trim() ? JSON.parse(fileContent) : [];

    // Validasi struktur data
    if (!Array.isArray(data)) {
      res.status(500).json({ message: 'Invalid data structure in file' });
      return;
    }

    // Kirim data ke frontend
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error retrieving position data for deviceId: ${req.params.deviceId}`, error);
    res.status(500).json({ message: 'Failed to retrieve position data', error });
  }
};

// Save position data
export const addPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      latitude,
      longitude,
      speed,
      course,
      altitude,
      satellite,
      timestamp,
      roll,
      pitch,
      yaw,
      depth,
    } = req.body;

    const apiKey = req.header('X-API-Key');
    if (!apiKey) {
      res.status(401).json({ message: 'API Key is missing' });
      return;
    }

    const devices = await readCsv(devicesFilePath);
    const device = devices.find((d) => d.apiKey === apiKey);

    if (!device) {
      res.status(403).json({ message: 'Invalid API Key' });
      return;
    }

    const positionData = {
      latitude,
      longitude,
      speed,
      course,
      altitude,
      satellite,
      roll,
      pitch,
      yaw,
      depth,
      timestamp: timestamp || new Date().toISOString(),
      deviceId: device.id,
    };

    await saveOrUpdatePosition(positionData); // Gunakan fungsi untuk menyimpan atau memperbarui data
    res.status(201).json({ message: 'Position data saved successfully', position: positionData });
  } catch (error) {
    console.error('Error in addPosition:', error);
    res.status(500).json({ message: 'Failed to save position data', error });
  }
};
