# Setup Guide

## Prerequisites Installation

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### 3. Install Anchor
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### 4. Install Node.js (18+)
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 5. Install MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Or use MongoDB Atlas (cloud)
```

## Project Setup

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Build Anchor Program
```bash
anchor build
```

### 3. Start Local Validator (in separate terminal)
```bash
solana-test-validator
```

### 4. Deploy Program
```bash
# In a new terminal
anchor deploy
```

### 5. Initialize Marketplace
```bash
ts-node scripts/initialize-marketplace.ts
```

### 6. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 7. Setup Frontend
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_SOLANA_RPC_URL
npm run dev
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=pokemon_marketplace
SOLANA_RPC_URL=https://api.devnet.solana.com
IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Testing

```bash
# Run Anchor tests
anchor test

# Run backend tests (if implemented)
cd backend && npm test

# Run frontend tests (if implemented)
cd frontend && npm test
```

## Development Workflow

1. **Start local validator**: `solana-test-validator`
2. **Deploy program**: `anchor deploy`
3. **Start backend**: `cd backend && npm run dev`
4. **Start frontend**: `cd frontend && npm run dev`
5. **Open browser**: `http://localhost:3000`

## Troubleshooting

### Program ID Mismatch
If you get program ID errors, update `Anchor.toml` and `lib.rs` with your deployed program ID:
```bash
anchor keys list
# Update Anchor.toml and lib.rs declare_id!()
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl start mongod`
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Wallet Connection Issues
- Ensure you're using a compatible wallet (Phantom, Backpack)
- Check RPC endpoint is accessible
- Verify network matches (devnet/mainnet)

