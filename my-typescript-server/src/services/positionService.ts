import fs from 'fs';
import path from 'path';

interface PositionData {
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  altitude: number;
  satellite: number;
  roll: number;
  pitch: number;
  yaw: number;
  depth: number;
  timestamp: string; // Timestamp digunakan untuk menandai data
  deviceId: string;  // Device ID sebagai pengenal unik
}

// Folder tempat data perangkat disimpan
const positionsFolder = path.join(__dirname, '../../data/devices');

// Fungsi untuk mendapatkan path file berdasarkan `deviceId`
const getDeviceFilePath = (deviceId: string): string => {
  return path.join(positionsFolder, `${deviceId}.json`);
};

// Fungsi untuk menyimpan atau memperbarui data posisi
export const saveOrUpdatePosition = async (data: PositionData): Promise<void> => {
  try {
    // Pastikan folder `positionsFolder` ada
    if (!fs.existsSync(positionsFolder)) {
      fs.mkdirSync(positionsFolder, { recursive: true });
    }

    const filePath = getDeviceFilePath(data.deviceId);

    // Tulis langsung data baru ke file JSON, menggantikan data lama
    const latestData = [data]; // Hanya menyimpan data terbaru
    fs.writeFileSync(filePath, JSON.stringify(latestData, null, 2));

    console.log(`Position data saved/updated for device ${data.deviceId}`);
  } catch (error) {
    console.error(`Error saving or updating position data for device ${data.deviceId}:`, error);
    throw new Error(`Error saving or updating position data for device ${data.deviceId}: ${error}`);
  }
};

// Fungsi untuk mendapatkan data posisi
export const getPositions = async (deviceId?: string): Promise<PositionData[]> => {
  try {
    console.log('Fetching positions for deviceId:', deviceId || 'ALL');

    if (deviceId) {
      // Ambil data untuk perangkat tertentu
      const filePath = getDeviceFilePath(deviceId);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found for deviceId: ${deviceId}`);
        return [];
      }

      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`Data for device ${deviceId}:`, fileContent);
      return fileContent;
    } else {
      // Jika `deviceId` tidak diberikan, baca semua file JSON di folder
      if (!fs.existsSync(positionsFolder)) {
        console.warn('Positions folder not found');
        return [];
      }

      const files = fs.readdirSync(positionsFolder).filter((file) => file.endsWith('.json'));
      console.log('Available files:', files);

      const allData = files.flatMap((file) => {
        const content = JSON.parse(fs.readFileSync(path.join(positionsFolder, file), 'utf-8'));
        return content;
      });
      console.log('All data:', allData);
      return allData;
    }
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw new Error(`Error fetching positions: ${error}`);
  }
};
