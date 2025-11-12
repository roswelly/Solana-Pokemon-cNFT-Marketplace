'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Pokémon cNFT Marketplace</h1>
          <WalletMultiButton />
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl font-bold text-white mb-4">
            Catch, Evolve, Trade
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Your Pokémon adventure on Solana begins here
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Mint</h3>
            <p className="text-gray-200">
              Create your own Pokémon cNFTs with unique attributes and rarities
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Evolve</h3>
            <p className="text-gray-200">
              Level up your Pokémon and evolve them into stronger forms
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Trade</h3>
            <p className="text-gray-200">
              Buy and sell Pokémon on the marketplace with Tensor integration
            </p>
          </motion.div>
        </div>

        {connected && (
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Browse Marketplace
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

