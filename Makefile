.PHONY: install build test deploy dev clean

install:
	npm install
	cd backend && npm install
	cd frontend && npm install

build:
	anchor build

test:
	anchor test

deploy:
	anchor deploy

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

dev: dev-backend dev-frontend

clean:
	rm -rf target/
	rm -rf node_modules/
	rm -rf backend/node_modules/
	rm -rf frontend/node_modules/
	rm -rf frontend/.next/

setup: install build deploy
	@echo "✅ Setup complete! Run 'make dev' to start development servers"

