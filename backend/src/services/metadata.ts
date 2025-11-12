import { PokemonMetadata, PokemonAttributes } from '../models/Pokemon';

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B6B',
  Water: '#4ECDC4',
  Grass: '#95E1D3',
  Electric: '#FFE66D',
  Psychic: '#A8E6CF',
  Normal: '#D3D3D3',
};

const RARITY_MULTIPLIERS: Record<string, number> = {
  Common: 1.0,
  Uncommon: 1.2,
  Rare: 1.5,
  Epic: 2.0,
  Legendary: 3.0,
};

export function generatePokemonMetadata(
  mint: string,
  owner: string,
  attributes: PokemonAttributes
): PokemonMetadata {
  const power = Math.floor(attributes.power * (RARITY_MULTIPLIERS[attributes.rarity] || 1.0));
  
  return {
    name: `${attributes.species} #${mint.slice(0, 8)}`,
    description: `A ${attributes.rarity} ${attributes.element}-type Pokémon at level ${attributes.level} with ${power} power.`,
    image: generateImageUrl(attributes),
    attributes: {
      ...attributes,
      power,
    },
    properties: {
      mint,
      owner,
      mintTimestamp: Date.now(),
      evolutionCount: 0,
    },
  };
}

function generateImageUrl(attributes: PokemonAttributes): string {
  // In production, you would upload images to IPFS/Arweave
  // For now, return a placeholder or use a service like PokeAPI
  const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  const pokemonId = getPokemonId(attributes.species);
  return `${baseUrl}/other/official-artwork/${pokemonId}.png`;
}

function getPokemonId(species: string): number {
  const pokemonMap: Record<string, number> = {
    'Pikachu': 25,
    'Raichu': 26,
    'Charmander': 4,
    'Charmeleon': 5,
    'Charizard': 6,
    'Bulbasaur': 1,
    'Ivysaur': 2,
    'Venusaur': 3,
    'Squirtle': 7,
    'Wartortle': 8,
    'Blastoise': 9,
  };
  return pokemonMap[species] || 1;
}

