use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod pokemon_marketplace {
    use super::*;

    pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.bump = ctx.bumps.marketplace;
        marketplace.total_listings = 0;
        marketplace.total_sales = 0;
        msg!("Marketplace initialized by: {}", marketplace.authority);
        Ok(())
    }

    pub fn mint_cnft(
        ctx: Context<MintCnft>,
        species: String,
        level: u8,
        rarity: String,
        power: u16,
        element: String,
        metadata_uri: String,
    ) -> Result<()> {
        let pokemon = &mut ctx.accounts.pokemon;
        pokemon.owner = ctx.accounts.owner.key();
        pokemon.species = species;
        pokemon.level = level;
        pokemon.rarity = rarity;
        pokemon.power = power;
        pokemon.element = element;
        pokemon.metadata_uri = metadata_uri;
        pokemon.mint_timestamp = Clock::get()?.unix_timestamp;
        pokemon.evolution_count = 0;
        pokemon.bump = ctx.bumps.pokemon;
        
        msg!("Minted cNFT: {} (Level {})", pokemon.species, pokemon.level);
        Ok(())
    }

    pub fn evolve_cnft(
        ctx: Context<EvolveCnft>,
        new_species: String,
        new_level: u8,
        new_power: u16,
        new_metadata_uri: String,
    ) -> Result<()> {
        let pokemon = &mut ctx.accounts.pokemon;
        
        require!(
            pokemon.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );
        
        require!(
            new_level > pokemon.level,
            ErrorCode::InvalidEvolution
        );

        // Transfer evolution fee
        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.marketplace_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 100_000_000)?; // 0.1 SOL worth of tokens

        pokemon.species = new_species;
        pokemon.level = new_level;
        pokemon.power = new_power;
        pokemon.metadata_uri = new_metadata_uri;
        pokemon.evolution_count = pokemon.evolution_count.checked_add(1).unwrap();
        
        msg!("Evolved cNFT to: {} (Level {})", pokemon.species, pokemon.level);
        Ok(())
    }

    pub fn list_cnft(
        ctx: Context<ListCnft>,
        price: u64,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        let pokemon = &ctx.accounts.pokemon;
        
        require!(
            pokemon.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );

        listing.pokemon = pokemon.key();
        listing.owner = ctx.accounts.owner.key();
        listing.price = price;
        listing.is_active = true;
        listing.created_at = Clock::get()?.unix_timestamp;
        listing.bump = ctx.bumps.listing;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_listings = marketplace.total_listings.checked_add(1).unwrap();
        
        msg!("Listed cNFT for {} lamports", price);
        Ok(())
    }

    pub fn buy_cnft(ctx: Context<BuyCnft>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        let pokemon = &mut ctx.accounts.pokemon;
        
        require!(listing.is_active, ErrorCode::ListingInactive);
        require!(listing.price <= ctx.accounts.buyer.lamports(), ErrorCode::InsufficientFunds);

        // Transfer SOL from buyer to seller
        **ctx.accounts.buyer.try_borrow_mut_lamports()? -= listing.price;
        **ctx.accounts.seller.try_borrow_mut_lamports()? += listing.price;

        // Transfer ownership
        pokemon.owner = ctx.accounts.buyer.key();
        listing.is_active = false;

        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.total_sales = marketplace.total_sales.checked_add(1).unwrap();
        
        msg!("Sold cNFT for {} lamports", listing.price);
        Ok(())
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        
        require!(
            listing.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );
        require!(listing.is_active, ErrorCode::ListingInactive);

        listing.is_active = false;
        msg!("Cancelled listing");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Marketplace::LEN,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCnft<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Pokemon::LEN,
        seeds = [b"pokemon", owner.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub pokemon: Account<'info, Pokemon>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EvolveCnft<'info> {
    #[account(mut)]
    pub pokemon: Account<'info, Pokemon>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub marketplace_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    
    pub marketplace: Account<'info, Marketplace>,
}

#[derive(Accounts)]
pub struct ListCnft<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Listing::LEN,
        seeds = [b"listing", pokemon.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    
    #[account(mut)]
    pub pokemon: Account<'info, Pokemon>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: Marketplace account
    #[account(
        seeds = [b"marketplace"],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyCnft<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    
    #[account(mut)]
    pub pokemon: Account<'info, Pokemon>,
    
    /// CHECK: Buyer account
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: Seller account
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    
    /// CHECK: Marketplace account
    #[account(
        seeds = [b"marketplace"],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    
    pub owner: Signer<'info>,
}

#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_listings: u64,
    pub total_sales: u64,
}

impl Marketplace {
    pub const LEN: usize = 32 + 1 + 8 + 8;
}

#[account]
pub struct Pokemon {
    pub owner: Pubkey,
    pub species: String,
    pub level: u8,
    pub rarity: String,
    pub power: u16,
    pub element: String,
    pub metadata_uri: String,
    pub mint_timestamp: i64,
    pub evolution_count: u8,
    pub bump: u8,
}

impl Pokemon {
    pub const LEN: usize = 32 + // owner
        4 + 50 + // species (String)
        1 + // level
        4 + 20 + // rarity (String)
        2 + // power
        4 + 20 + // element (String)
        4 + 200 + // metadata_uri (String)
        8 + // mint_timestamp
        1 + // evolution_count
        1; // bump
}

#[account]
pub struct Listing {
    pub pokemon: Pubkey,
    pub owner: Pubkey,
    pub price: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl Listing {
    pub const LEN: usize = 32 + // pokemon
        32 + // owner
        8 + // price
        1 + // is_active
        8 + // created_at
        1; // bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid evolution")]
    InvalidEvolution,
    #[msg("Listing is not active")]
    ListingInactive,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

