import { Router } from 'express';
import { getDatabase } from '../db';
import { generatePokemonMetadata } from '../services/metadata';

const router = Router();

// Get metadata for a Pokémon
router.get('/:mint', async (req, res) => {
  try {
    const { mint } = req.params;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const pokemon = await collection.findOne({ mint });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }
    
    res.json(pokemon.metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// Generate and store metadata
router.post('/generate', async (req, res) => {
  try {
    const { mint, owner, attributes } = req.body;
    const metadata = generatePokemonMetadata(mint, owner, attributes);
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate metadata' });
  }
});

export { router as metadataRoutes };

