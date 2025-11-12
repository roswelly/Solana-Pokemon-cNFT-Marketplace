import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';
import { PokemonMarketplace } from '../target/types/pokemon_marketplace';

describe('pokemon-marketplace', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PokemonMarketplace as Program<PokemonMarketplace>;
  const user = Keypair.generate();

  let marketplacePda: PublicKey;
  let marketplaceBump: number;

  before(async () => {
    // Airdrop SOL to user
    const airdropSignature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Find marketplace PDA
    [marketplacePda, marketplaceBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('marketplace')],
      program.programId
    );
  });

  it('Initializes the marketplace', async () => {
    const tx = await program.methods
      .initializeMarketplace()
      .accounts({
        marketplace: marketplacePda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const marketplace = await program.account.marketplace.fetch(marketplacePda);
    expect(marketplace.authority.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(marketplace.totalListings.toNumber()).to.equal(0);
    expect(marketplace.totalSales.toNumber()).to.equal(0);
  });

  it('Mints a cNFT', async () => {
    const timestamp = Date.now();
    const [pokemonPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pokemon'),
        user.publicKey.toBuffer(),
        Buffer.from(timestamp.toString()),
      ],
      program.programId
    );

    const species = 'Pikachu';
    const level = 5;
    const rarity = 'Rare';
    const power = 150;
    const element = 'Electric';
    const metadataUri = 'https://ipfs.io/ipfs/test123';

    const tx = await program.methods
      .mintCnft(species, level, rarity, power, element, metadataUri)
      .accounts({
        pokemon: pokemonPda,
        owner: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const pokemon = await program.account.pokemon.fetch(pokemonPda);
    expect(pokemon.species).to.equal(species);
    expect(pokemon.level).to.equal(level);
    expect(pokemon.rarity).to.equal(rarity);
    expect(pokemon.power.toNumber()).to.equal(power);
    expect(pokemon.element).to.equal(element);
    expect(pokemon.owner.toString()).to.equal(user.publicKey.toString());
  });

  it('Lists a cNFT', async () => {
    const timestamp = Date.now();
    const [pokemonPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('pokemon'),
        user.publicKey.toBuffer(),
        Buffer.from(timestamp.toString()),
      ],
      program.programId
    );

    // First mint
    await program.methods
      .mintCnft('Charmander', 10, 'Common', 100, 'Fire', 'https://ipfs.io/ipfs/test456')
      .accounts({
        pokemon: pokemonPda,
        owner: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Then list
    const [listingPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('listing'), pokemonPda.toBuffer()],
      program.programId
    );

    const price = new anchor.BN(1_000_000_000); // 1 SOL

    await program.methods
      .listCnft(price)
      .accounts({
        listing: listingPda,
        pokemon: pokemonPda,
        owner: user.publicKey,
        marketplace: marketplacePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const listing = await program.account.listing.fetch(listingPda);
    expect(listing.price.toNumber()).to.equal(price.toNumber());
    expect(listing.isActive).to.be.true;
  });
});

