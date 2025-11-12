import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load IDL
  const idlPath = join(__dirname, '../target/idl/pokemon_marketplace.json');
  const idl = JSON.parse(readFileSync(idlPath, 'utf8'));
  
  const programId = new PublicKey(idl.metadata.address);
  const program = new Program(idl, programId, provider);

  // Find marketplace PDA
  const [marketplacePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('marketplace')],
    programId
  );

  console.log('Initializing marketplace...');
  console.log('Program ID:', programId.toString());
  console.log('Marketplace PDA:', marketplacePda.toString());
  console.log('Authority:', provider.wallet.publicKey.toString());

  try {
    const tx = await program.methods
      .initializeMarketplace()
      .accounts({
        marketplace: marketplacePda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('✅ Marketplace initialized!');
    console.log('Transaction signature:', tx);

    // Fetch and display marketplace state
    const marketplace = await program.account.marketplace.fetch(marketplacePda);
    console.log('\nMarketplace State:');
    console.log('- Authority:', marketplace.authority.toString());
    console.log('- Total Listings:', marketplace.totalListings.toString());
    console.log('- Total Sales:', marketplace.totalSales.toString());
  } catch (error: any) {
    if (error.message?.includes('already in use')) {
      console.log('⚠️  Marketplace already initialized');
    } else {
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

