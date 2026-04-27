
A full-stack web application where developers can build a public profile and post job listings.

## Tech Stack
- Frontend: Next.js 16.2 (App Router)
- Backend: NestJS
- Database: PostgreSQL + Prisma
- Auth: JWT + bcrypt

## Setup.

### Backend
```bash
cd devlink-api
npm install
cp .env.example .env   
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd devlink-web
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

## Environment Variables

### devlink-api `.env`

### devlink-web `.env.local`

