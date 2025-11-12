export interface PokemonAttributes {
  species: string;
  level: number;
  rarity: string;
  power: number;
  element: string;
}

export interface PokemonMetadata {
  name: string;
  description: string;
  image: string;
  attributes: PokemonAttributes;
  properties: {
    mint: string;
    owner: string;
    mintTimestamp: number;
    evolutionCount: number;
  };
}

export interface EvolutionRequirement {
  minLevel: number;
  requiredItems?: string[];
  cost?: number; // in lamports
}

export interface EvolutionPath {
  from: string;
  to: string;
  requirements: EvolutionRequirement;
}

// Evolution paths for different Pokémon species
export const EVOLUTION_PATHS: Record<string, EvolutionPath[]> = {
  'Pikachu': [
    {
      from: 'Pikachu',
      to: 'Raichu',
      requirements: {
        minLevel: 20,
        cost: 100_000_000, // 0.1 SOL
      },
    },
  ],
  'Charmander': [
    {
      from: 'Charmander',
      to: 'Charmeleon',
      requirements: {
        minLevel: 16,
        cost: 100_000_000,
      },
    },
    {
      from: 'Charmeleon',
      to: 'Charizard',
      requirements: {
        minLevel: 36,
        cost: 200_000_000,
      },
    },
  ],
  'Bulbasaur': [
    {
      from: 'Bulbasaur',
      to: 'Ivysaur',
      requirements: {
        minLevel: 16,
        cost: 100_000_000,
      },
    },
    {
      from: 'Ivysaur',
      to: 'Venusaur',
      requirements: {
        minLevel: 32,
        cost: 200_000_000,
      },
    },
  ],
  'Squirtle': [
    {
      from: 'Squirtle',
      to: 'Wartortle',
      requirements: {
        minLevel: 16,
        cost: 100_000_000,
      },
    },
    {
      from: 'Wartortle',
      to: 'Blastoise',
      requirements: {
        minLevel: 36,
        cost: 200_000_000,
      },
    },
  ],
};

export function getEvolutionPath(species: string): EvolutionPath | null {
  const paths = EVOLUTION_PATHS[species];
  if (!paths || paths.length === 0) return null;
  return paths[0];
}

export function canEvolve(species: string, level: number): boolean {
  const path = getEvolutionPath(species);
  if (!path) return false;
  return level >= path.requirements.minLevel;
}

export function getNextEvolution(species: string): string | null {
  const path = getEvolutionPath(species);
  return path ? path.to : null;
}

