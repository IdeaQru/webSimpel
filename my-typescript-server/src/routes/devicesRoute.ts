import express from 'express';
import { addDevice, editDevice, getDevices, removeDevice } from '../controllers/devicesController';

const router = express.Router();

// Route untuk menambahkan device
router.post('/devices:id', async (req, res, next) => {
  try {
    await addDevice(req, res);
  } catch (error) {
    next(error); // Pastikan error diteruskan ke middleware error handling
  }
});

// Route untuk mendapatkan daftar device
router.get('/devices', async (req, res, next) => {
  try {
    await getDevices(req, res);
  } catch (error) {
    next(error); // Pastikan error diteruskan ke middleware error handling
  }
});
// Mengedit perangkat berdasarkan ID
router.put('/devices/:id', editDevice);

// Menghapus perangkat berdasarkan ID
router.delete('/devices/:id', removeDevice);
export default router;
