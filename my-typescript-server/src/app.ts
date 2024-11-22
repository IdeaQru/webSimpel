import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'; // Untuk menangani path
import positionRoutes from './routes/positionRoute';
import devicesRoutes from './routes/devicesRoute';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', positionRoutes);
app.use('/api', devicesRoutes);

// Serve Angular dist folder
const distDir = path.join(__dirname, '../../dist/myapp'); // Path ke folder dist
app.use(express.static(distDir));

// Fallback route for Angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

export default app;
