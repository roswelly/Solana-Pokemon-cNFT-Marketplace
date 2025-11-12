import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PokemonAttributes {
  species: string;
  level: number;
  rarity: string;
  power: number;
  element: string;
}

export interface Pokemon {
  mint: string;
  owner: string;
  attributes: PokemonAttributes;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

export const pokemonApi = {
  getOwned: async (wallet: string): Promise<Pokemon[]> => {
    const response = await api.get(`/api/pokemon/owned/${wallet}`);
    return response.data;
  },

  getByMint: async (mint: string): Promise<Pokemon> => {
    const response = await api.get(`/api/pokemon/${mint}`);
    return response.data;
  },

  create: async (mint: string, owner: string, attributes: PokemonAttributes): Promise<Pokemon> => {
    const response = await api.post('/api/pokemon', { mint, owner, attributes });
    return response.data;
  },
};

export const evolutionApi = {
  canEvolve: async (mint: string) => {
    const response = await api.get(`/api/evolution/can-evolve/${mint}`);
    return response.data;
  },

  evolve: async (mint: string, newSpecies: string, newLevel: number, newPower: number) => {
    const response = await api.post('/api/evolution/evolve', {
      mint,
      newSpecies,
      newLevel,
      newPower,
    });
    return response.data;
  },

  getPaths: async () => {
    const response = await api.get('/api/evolution/paths');
    return response.data;
  },
};

