# 🐳 Docker Configuration

## Configuration Docker complète

### 📁 Fichiers Docker

- `Dockerfile` - Image multi-stage pour production
- `docker-compose.yml` - Environnement de développement
- `docker-compose.prod.yml` - Environnement de production
- `.dockerignore` - Fichiers à exclure de l'image
- `.env.docker.example` - Variables d'environnement exemple

## 🚀 Utilisation

### Développement

```bash
# Lancer l'environnement de développement
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Production

```bash
# Copier le fichier d'environnement
cp .env.docker.example .env.docker

# Éditer les variables d'environnement
nano .env.docker

# Lancer en production
docker-compose -f docker-compose.prod.yml --env-file .env.docker up -d

# Migrations de base de données
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

## 🔧 Configuration

### Variables d'environnement Docker

```env
# Database
POSTGRES_PASSWORD=your_secure_password

# NextAuth
NEXTAUTH_SECRET=your_32_char_secret_key
NEXTAUTH_URL=http://localhost:3000

# App
NODE_ENV=production
```

### Services inclus

- **app**: Application Next.js 15
- **postgres**: Base de données PostgreSQL 15
- **redis**: Cache Redis 7

### Health Check

L'application inclut un endpoint de santé : `/api/health`

- Vérifie la connexion à la base de données
- Retourne l'état de l'environnement
- Utilisé par Docker pour les health checks

## 📊 Monitoring

### Logs

```bash
# Logs de l'application
docker-compose logs app

# Logs de la base de données
docker-compose logs postgres

# Logs en temps réel
docker-compose logs -f
```

### Métriques

```bash
# État des conteneurs
docker-compose ps

# Utilisation des ressources
docker stats

# Health check
curl http://localhost:3000/api/health
```

## 🔄 Maintenance

### Mise à jour

```bash
# Rebuild l'image
docker-compose build --no-cache

# Redémarrer les services
docker-compose up -d --force-recreate
```

### Backup base de données

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres blog_db > backup.sql

# Restore
docker-compose exec -i postgres psql -U postgres blog_db < backup.sql
```

## 🛠️ Développement

### Hot reload

Le mode développement (`docker-compose.yml`) monte le code source comme volume pour le hot reload.

### Debug

```bash
# Accéder au conteneur
docker-compose exec app sh

# Débugger les logs
docker-compose logs -f app
```

## ⚡ Optimisations

### Image multi-stage

- **deps**: Installation des dépendances
- **builder**: Build de l'application + Prisma
- **runner**: Image finale optimisée

### Sécurité

- Utilisateur non-root (`nextjs`)
- Variables d'environnement sécurisées
- Health checks automatiques
- Restart policies

Cette configuration Docker est **production-ready** ! 🚀
