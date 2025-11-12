'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Marketplace() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            Pokémon Marketplace
          </Link>
          <WalletMultiButton />
        </nav>

        <h1 className="text-4xl font-bold text-white mb-8">Marketplace</h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Tensor Integration</h2>
          <p className="text-gray-200 mb-4">
            Browse and trade Pokémon cNFTs using Tensor SDK integration.
          </p>
          <p className="text-gray-300 text-sm">
            Note: Full Tensor SDK integration requires API keys and additional setup.
            This is a placeholder for the marketplace interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for marketplace listings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          >
            <div className="w-full h-48 bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-400">Pokémon Image</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pokémon Name</h3>
            <p className="text-gray-200 mb-4">Price: 1.5 SOL</p>
            {connected && (
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                Buy Now
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

