import { readCsv, writeToCsv } from '../utils/csvUtils';
import path from 'path';
import fs from 'fs';

const csvFilePath = path.join(__dirname, '../../data/devices.csv');

interface Device {
  id: string;
  name: string;
  apiKey: string;
  timestamp: string;
}

// Fungsi untuk membaca semua perangkat
export const getAllDevices = async (): Promise<Device[]> => {
  return await readCsv(csvFilePath);
};

// Fungsi untuk memperbarui perangkat berdasarkan ID
export const updateDevice = async (id: string, updatedData: Partial<Device>): Promise<Device | null> => {
  const devices = await getAllDevices();
  const index = devices.findIndex((device) => device.id === id);

  if (index === -1) {
    return null; // ID perangkat tidak ditemukan
  }

  // Perbarui data perangkat
  const updatedDevice = { ...devices[index], ...updatedData };
  devices[index] = updatedDevice;

  // Tulis ulang seluruh data ke file CSV
  await overwriteCsv(devices);

  return updatedDevice;
};

// Fungsi untuk menghapus perangkat berdasarkan ID
export const deleteDevice = async (id: string): Promise<boolean> => {
  const devices = await getAllDevices();
  const filteredDevices = devices.filter((device) => device.id !== id);

  if (devices.length === filteredDevices.length) {
    return false; // Tidak ada perangkat yang dihapus
  }

  // Tulis ulang seluruh data ke file CSV
  await overwriteCsv(filteredDevices);

  return true;
};

// Fungsi untuk menambahkan perangkat baru ke file CSV
export const saveDeviceToCsv = async (device: Device): Promise<void> => {
  const devices = await getAllDevices();
  devices.push(device);
  await overwriteCsv(devices);
};

// Fungsi untuk membaca semua perangkat dari file CSV
export const readDevicesFromCsv = async (): Promise<Device[]> => {
  return await getAllDevices();
};

// Fungsi utilitas untuk menimpa file CSV dengan data baru
const overwriteCsv = async (devices: Device[]): Promise<void> => {
  const header = 'id,name,apiKey,timestamp\n';
  const rows = devices
    .map((device) => `${device.id},${device.name},${device.apiKey},${device.timestamp}`)
    .join('\n');

  try {
    fs.writeFileSync(csvFilePath, header + rows, 'utf8');
  } catch (error) {
    console.error('Error overwriting CSV:', error);
    throw error;
  }
};
