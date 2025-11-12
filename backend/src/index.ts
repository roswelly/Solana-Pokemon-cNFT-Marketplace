import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './db';
import { pokemonRoutes } from './routes/pokemon';
import { evolutionRoutes } from './routes/evolution';
import { metadataRoutes } from './routes/metadata';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/evolution', evolutionRoutes);
app.use('/api/metadata', metadataRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

