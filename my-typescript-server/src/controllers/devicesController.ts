import { Request, Response } from 'express';
import { saveDeviceToCsv, readDevicesFromCsv, updateDevice, getAllDevices, deleteDevice } from '../services/devicesService';
import { v4 as uuidv4 } from 'uuid'; // Gunakan UUID untuk membuat API key unik


// Mengedit perangkat
export const editDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ message: 'Device name is required and must be a non-empty string.' });
      return;
    }

    const updatedDevice = await updateDevice(id, { name: name.trim() });

    if (!updatedDevice) {
      res.status(404).json({ message: 'Device not found' });
      return;
    }

    res.status(200).json({ message: 'Device updated successfully', device: updatedDevice });
  } catch (error) {
    console.error('Error in editDevice:', error);
    res.status(500).json({ message: 'Failed to update device', error });
  }
};

// Menghapus perangkat
export const removeDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const isDeleted = await deleteDevice(id);

    if (!isDeleted) {
      res.status(404).json({ message: 'Device not found' });
      return;
    }

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error in removeDevice:', error);
    res.status(500).json({ message: 'Failed to delete device', error });
  }
};
// Menyimpan device ke file CSV
export const addDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, apiKey } = req.body;

    // Validasi input
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ message: 'Device name is required and must be a non-empty string.' });
      return;
    }

    // Buat API key jika tidak disediakan
    const generatedApiKey = apiKey || uuidv4();

    const device = {
      id: uuidv4(), // ID unik untuk device
      name: name.trim(),
      apiKey: generatedApiKey,
      timestamp: new Date().toISOString(),
    };

    await saveDeviceToCsv(device);
    res.status(201).json({ message: 'Device saved successfully', device });
  } catch (error) {
    console.error('Error in addDevice:', error);
    res.status(500).json({ message: 'Failed to save device', error });
  }
};

// Mendapatkan daftar device dari file CSV
export const getDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const devices = await readDevicesFromCsv();

    // Jika tidak ada device yang ditemukan
    if (!devices || devices.length === 0) {
      res.status(404).json({ message: 'No devices found.' });
      return;
    }

    res.status(200).json(devices);
  } catch (error) {
    console.error('Error in getDevices:', error);
    res.status(500).json({ message: 'Failed to fetch devices', error });
  }
};
