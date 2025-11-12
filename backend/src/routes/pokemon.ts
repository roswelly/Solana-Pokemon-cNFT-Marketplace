import { Router } from 'express';
import { getDatabase } from '../db';
import { generatePokemonMetadata } from '../services/metadata';

const router = Router();

// Get all Pokémon owned by a wallet
router.get('/owned/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const pokemon = await collection.find({ owner: wallet }).toArray();
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon' });
  }
});

// Get Pokémon by mint address
router.get('/:mint', async (req, res) => {
  try {
    const { mint } = req.params;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const pokemon = await collection.findOne({ mint });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon' });
  }
});

// Create new Pokémon metadata
router.post('/', async (req, res) => {
  try {
    const { mint, owner, attributes } = req.body;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const metadata = generatePokemonMetadata(mint, owner, attributes);
    
    const pokemon = {
      mint,
      owner,
      attributes,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await collection.insertOne(pokemon);
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Pokémon' });
  }
});

export { router as pokemonRoutes };

