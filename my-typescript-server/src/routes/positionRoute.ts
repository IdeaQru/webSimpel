import express from 'express';
import { addPosition, getAllPositions, getPositionByDeviceId } from '../controllers/positionController';

const router = express.Router();

// Route to save position data
router.post('/position', addPosition);

// Route to retrieve all position data
router.get('/position', getAllPositions);
router.get('/position/:deviceId', getPositionByDeviceId);

export default router;
