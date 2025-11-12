'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import Link from 'next/link';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '@/idl/pokemon_marketplace.json';

const SPECIES = ['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const ELEMENTS = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Normal'];

export default function MintPage() {
  const { publicKey, connected, signTransaction } = useWallet();
  const [species, setSpecies] = useState(SPECIES[0]);
  const [level, setLevel] = useState(1);
  const [rarity, setRarity] = useState(RARITIES[0]);
  const [power, setPower] = useState(100);
  const [element, setElement] = useState(ELEMENTS[0]);
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    setMinting(true);
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
      );

      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions: async (txs) => {
            return txs.map((tx) => {
              // This is a simplified version - in production, you'd use the actual wallet adapter
              return tx;
            });
          },
        } as any,
        { commitment: 'confirmed' }
      );

      const programId = new PublicKey(idl.metadata.address);
      const program = new Program(idl as any, programId, provider);

      // Generate metadata URI (in production, upload to IPFS first)
      const metadataUri = `https://api.example.com/metadata/${Date.now()}`;

      // Find PDA for pokemon
      const [pokemonPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('pokemon'),
          publicKey.toBuffer(),
          Buffer.from(Date.now().toString()),
        ],
        programId
      );

      // Call mint_cnft instruction
      const tx = await program.methods
        .mintCnft(species, level, rarity, power, element, metadataUri)
        .accounts({
          pokemon: pokemonPda,
          owner: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert(`Minted successfully! Transaction: ${tx}`);
    } catch (error) {
      console.error('Minting error:', error);
      alert('Failed to mint: ' + (error as Error).message);
    } finally {
      setMinting(false);
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

        <h1 className="text-4xl font-bold text-white mb-8">Mint Pokémon</h1>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-bold mb-2">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full p-3 rounded bg-white/20 text-white"
              >
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Level</label>
              <input
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full p-3 rounded bg-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Rarity</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="w-full p-3 rounded bg-white/20 text-white"
              >
                {RARITIES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Power</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={power}
                onChange={(e) => setPower(parseInt(e.target.value))}
                className="w-full p-3 rounded bg-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Element</label>
              <select
                value={element}
                onChange={(e) => setElement(e.target.value)}
                className="w-full p-3 rounded bg-white/20 text-white"
              >
                {ELEMENTS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleMint}
              disabled={minting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {minting ? 'Minting...' : 'Mint Pokémon'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

