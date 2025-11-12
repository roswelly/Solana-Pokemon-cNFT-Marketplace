import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const getConnection = (): Connection => {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');
  return new Connection(rpcUrl, 'confirmed');
};

export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export const findMarketplacePDA = (): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('marketplace')],
    PROGRAM_ID
  );
};

export const findPokemonPDA = (owner: PublicKey, timestamp: number): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('pokemon'),
      owner.toBuffer(),
      Buffer.from(timestamp.toString()),
    ],
    PROGRAM_ID
  );
};

export const findListingPDA = (pokemon: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('listing'), pokemon.toBuffer()],
    PROGRAM_ID
  );
};

