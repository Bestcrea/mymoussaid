# Moroccan Architects — Plateforme de gestion de projets

## Stack technique
- **Frontend** : React 18 + Vite + TypeScript + Tailwind CSS
- **Backend** : Node.js 20 + Express.js + TypeScript
- **Base de données** : PostgreSQL 16 + Prisma ORM
- **Cache / Queue** : Redis 7 + BullMQ
- **Fichiers** : Minio (compatible S3)
- **Temps réel** : Socket.io
- **Monorepo** : pnpm workspaces + Turborepo
- **Hébergement** : Hostinger VPS + Nginx + PM2

## Démarrage rapide

### Prérequis
- Node.js >= 20
- pnpm >= 9
- Docker Desktop

### 1. Cloner et installer
```bash
git clone https://github.com/your-org/moroccan-architects.git
cd moroccan-architects
pnpm install
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 3. Démarrer les services Docker
```bash
docker compose -f docker/docker-compose.yml up -d postgres redis minio
```

### 4. Initialiser la base de données
```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Démarrer en développement
```bash
pnpm dev
# API  → http://localhost:3001
# Web  → http://localhost:5173
# Minio Console → http://localhost:9001
```

## Structure du projet
```
moroccan-architects/
├── apps/
│   ├── api/          ← Express API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── lib/       (redis, minio, jwt, socket, prisma)
│   │   │   └── index.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   └── web/          ← React frontend
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── store/
│           ├── lib/
│           └── i18n/
├── packages/
│   └── shared/       ← Types + Zod schemas partagés
├── docker/
│   ├── docker-compose.yml
│   └── nginx.conf
└── .github/workflows/deploy.yml
```

## Sprints
| Sprint | Contenu | Semaines |
|--------|---------|----------|
| 1 | Infrastructure & setup | 1–2 |
| 2 | Auth + base de données | 3–4 |
| 3 | Projets + documents | 5–7 |
| 4 | Appels d'offres | 8–10 |
| 5 | Messagerie + e-signature | 11–13 |
| 6 | i18n + sécurité + prod | 14–16 |

## Déploiement (Hostinger VPS)
Les secrets GitHub requis :
- `VPS_HOST` : IP de votre VPS Hostinger
- `VPS_USER` : utilisateur SSH (ex: `ubuntu`)
- `VPS_SSH_KEY` : clé SSH privée
