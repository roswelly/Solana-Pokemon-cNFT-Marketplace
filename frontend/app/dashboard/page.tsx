'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';

interface Pokemon {
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
  };
}

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && publicKey) {
      fetchPokemon();
    }
  }, [connected, publicKey]);

  const fetchPokemon = async () => {
    if (!publicKey) return;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/pokemon/owned/${publicKey.toBase58()}`
      );
      setPokemon(response.data);
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Please Connect Your Wallet</h1>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            Pokémon Marketplace
          </Link>
          <WalletMultiButton />
        </nav>

        <h1 className="text-4xl font-bold text-white mb-8">My Pokémon</h1>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : pokemon.length === 0 ? (
          <div className="text-center text-white">
            <p className="text-xl mb-4">You don't have any Pokémon yet!</p>
            <Link
              href="/mint"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition inline-block"
            >
              Mint Your First Pokémon
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemon.map((p, index) => (
              <motion.div
                key={p.mint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
              >
                <img
                  src={p.metadata.image}
                  alt={p.metadata.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-2">{p.metadata.name}</h3>
                <div className="space-y-2 text-sm text-gray-200">
                  <p>Level: {p.attributes.level}</p>
                  <p>Rarity: {p.attributes.rarity}</p>
                  <p>Power: {p.attributes.power}</p>
                  <p>Element: {p.attributes.element}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/pokemon/${p.mint}/evolve`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition text-center"
                  >
                    Evolve
                  </Link>
                  <Link
                    href={`/pokemon/${p.mint}/list`}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition text-center"
                  >
                    List
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

