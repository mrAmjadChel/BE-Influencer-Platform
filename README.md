# Discovery Influencers Platform

A full-stack web application to manage influencer profiles, track engagement metrics, and filter by category, city, and tier.

---

## Tech Stack

**Frontend**
- Next.js 16 (React 18)
- TailwindCSS
- Lucide Icons

**Backend**
- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Development Tools**
- DBeaver (DB client)
- Postman 
- ESLint + Prettier
- dotenv

---

## Architecture
- Frontend: Component-based, responsive UI, sticky filter sidebar, filter functionality
- Backend: MVC (Controller → Service → Prisma)  
- Database: Relational schema for `Person`, `InfluencerProfile`, `User`, etc.  
- Authentication: JWT Bearer Token


---

## Setup

1. **Clone the repo**
```bash
git clone https://github.com/your/repo.git
cd repo

cd frontend
npm install

cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```
---

## Environment Variables
**Frontend (frontend/.env.local)**
```bash
NEXT_PUBLIC_API_URL=https://be-influencer-platform.onrender.com/api
```

**Backend (backend/.env)**
```bash
DATABASE_URL=postgresql://influencer_db_user:lei6gRtXnwv3TpA1aIgs6wKzQTPUEu5E@dpg-d4d5eqqli9vc73cbj84g-a.singapore-postgres.render.com/influencer_db_33k5
JWT_SECRET=supersecret_jwt_key_12345
JWT_EXPIRY=7h

```

## Seed / Data Import
```bash
cd backend
npm run seed

```
- people_influencers_data.sql (เขียน SQL ผ่าน DBeaver)

## Running the Project

-Frontend
```bash
cd Frontend
npm run dev
```

-Backend
```bash
cd backend
npm run dev
```




## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
