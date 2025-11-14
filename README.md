# Pokémon cNFT Marketplace

A complete Pokémon-style compressed NFT marketplace built on Solana using Anchor, TypeScript, and Next.js.

## Project Structure

```
Pokmon/
├── programs/
│   └── pokemon_marketplace/     # Anchor smart contract
├── backend/                      # Node.js + Express API
├── frontend/                     # Next.js DApp
├── scripts/                      # Deployment scripts
└── tests/                        # Anchor tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI
- MongoDB (for backend)

### Installation

1. **Install dependencies:**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. **Build Anchor program:**
```bash
anchor build
```

3. **Start local validator:**
```bash
solana-test-validator
```

4. **Deploy program:**
```bash
anchor deploy
```

5. **Start backend:**
```bash
cd backend
npm run dev
```

6. **Start frontend:**
```bash
cd frontend
npm run dev
```

## Features

### Smart Contract (Anchor)

- `initialize_marketplace()` - Initialize marketplace state
- `mint_cnft()` - Mint compressed NFTs with Pokémon attributes
- `evolve_cnft()` - Evolve Pokémon when conditions are met
- `list_cnft()` - List Pokémon for sale
- `buy_cnft()` - Purchase listed Pokémon
- `cancel_listing()` - Cancel active listings

### Backend API

- `/api/pokemon` - Pokémon CRUD operations
- `/api/evolution` - Evolution logic and validation
- `/api/metadata` - Metadata generation and IPFS integration

### Frontend DApp

- Wallet connection (Phantom, Backpack)
- Dashboard to view owned Pokémon
- Minting interface
- Evolution interface
- Marketplace browsing
- Tensor SDK integration (placeholder)

## Testing

```bash
anchor test
```

## Environment Variables

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=pokemon_marketplace
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Development

### Anchor Program
- Located in `programs/pokemon_marketplace/`
- Main logic in `src/lib.rs`
- Build with `anchor build`
- Deploy with `anchor deploy`

### Backend
- TypeScript + Express
- MongoDB for data persistence
- IPFS for metadata storage
- Run with `npm run dev`

### Frontend
- Next.js 14 with App Router
- Tailwind CSS for styling
- Solana Wallet Adapter
- Framer Motion for animations

## License

MIT

