# A2SV E-commerce Backend (Node.js + TypeScript + Express + Prisma)

## Tech Stack
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- Zod for validation
- bcrypt for password hashing
- JWT for authentication
- Helmet, CORS, Morgan

## Folder Structure
- src/controllers
- src/services
- src/routes
- src/middlewares
- src/utils
- prisma/schema.prisma

## Environment Variables
Copy `.env.example` to `.env` and fill in values:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="your-strong-secret"
PORT=4000
NODE_ENV=development
```

## Install & Run
1. Install dependencies
```
npm install
```
2. Generate Prisma client
```
npm run prisma:generate
```
3. Run migrations (creates DB tables)
```
npm run prisma:migrate -- --name init
```
4. Start the dev server
```
npm run dev
```
Server will run at http://localhost:4000

## Seeding an Admin (optional)
By default, registered users have role `USER`. To make an admin, update a user directly in the DB:
```
UPDATE "User" SET role='ADMIN' WHERE email='admin@example.com';
```

## API Endpoints
Base response shape:
- success: boolean
- message: string
- object: object or list (for paginated), null on error
- errors: list of strings or null

### Auth
- POST /auth/register
  - body: { username, email, password }
  - 201 on success
- POST /auth/login
  - body: { email, password }
  - 200 returns { token, user }

### Products
- GET /products
  - Query: page, limit/pageSize, search
  - Public, paginated
- GET /products/:id
  - Public
- POST /products
  - Admin only (Bearer token)
  - body: { name, description, price, stock, category }
- PUT /products/:id
  - Admin only
- DELETE /products/:id
  - Admin only

### Orders
- POST /orders
  - User only (Bearer token)
  - body: [{ productId, quantity }, ...]
  - Transactional, validates stock and calculates total on server
- GET /orders
  - Authenticated user
  - Returns only orders for the authenticated user

## Notes
- Product list GET uses a simple in-memory cache (30s TTL).
- Prices use Prisma Decimal in DB; totals calculated server-side.
- Validation errors return 400 with specific messages from Zod.

## Scripts
- dev: ts-node-dev server
- build: compile to dist
- start: run compiled build
- prisma:generate: generate Prisma client
- prisma:migrate: run dev migrations
- prisma:deploy: deploy migrations in prod

## Testing (Bonus, not implemented)
- You can add tests with Jest and mock Prisma client for services.
