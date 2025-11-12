import { Router } from 'express';
import { getDatabase } from '../db';
import { canEvolve, getNextEvolution, getEvolutionPath, EVOLUTION_PATHS } from '../models/Pokemon';
import { generatePokemonMetadata } from '../services/metadata';

const router = Router();

// Check if a Pokémon can evolve
router.get('/can-evolve/:mint', async (req, res) => {
  try {
    const { mint } = req.params;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const pokemon = await collection.findOne({ mint });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }
    
    const evolvable = canEvolve(pokemon.attributes.species, pokemon.attributes.level);
    const nextEvolution = getNextEvolution(pokemon.attributes.species);
    const evolutionPath = getEvolutionPath(pokemon.attributes.species);
    
    res.json({
      canEvolve: evolvable,
      nextEvolution,
      requirements: evolutionPath?.requirements || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check evolution' });
  }
});

// Evolve a Pokémon
router.post('/evolve', async (req, res) => {
  try {
    const { mint, newSpecies, newLevel, newPower } = req.body;
    const db = getDatabase();
    const collection = db.collection('pokemon');
    
    const pokemon = await collection.findOne({ mint });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }
    
    // Validate evolution
    if (!canEvolve(pokemon.attributes.species, pokemon.attributes.level)) {
      return res.status(400).json({ error: 'Pokémon cannot evolve yet' });
    }
    
    const nextEvolution = getNextEvolution(pokemon.attributes.species);
    if (nextEvolution !== newSpecies) {
      return res.status(400).json({ error: 'Invalid evolution path' });
    }
    
    // Update Pokémon attributes
    const updatedAttributes = {
      ...pokemon.attributes,
      species: newSpecies,
      level: newLevel,
      power: newPower,
    };
    
    const updatedMetadata = generatePokemonMetadata(
      mint,
      pokemon.owner,
      updatedAttributes
    );
    
    await collection.updateOne(
      { mint },
      {
        $set: {
          attributes: updatedAttributes,
          metadata: updatedMetadata,
          updatedAt: new Date(),
          evolutionCount: (pokemon.evolutionCount || 0) + 1,
        },
      }
    );
    
    const updatedPokemon = await collection.findOne({ mint });
    res.json(updatedPokemon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to evolve Pokémon' });
  }
});

// Get all evolution paths
router.get('/paths', (req, res) => {
  res.json(EVOLUTION_PATHS);
});

export { router as evolutionRoutes };

