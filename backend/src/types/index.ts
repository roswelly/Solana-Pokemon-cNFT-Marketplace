export interface PokemonDocument {
  _id?: string;
  mint: string;
  owner: string;
  attributes: {
    species: string;
    level: number;
    rarity: string;
    power: number;
    element: string;
  };
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: any;
    properties: any;
  };
  evolutionCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

