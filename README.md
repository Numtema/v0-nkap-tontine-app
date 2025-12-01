# Nkap - Application de Tontine Africaine

Nkap est une plateforme moderne de gestion de tontines avec une monnaie électronique interne.

## Variables d'environnement requises

### En développement (v0 preview)
Laissez `NEXT_PUBLIC_SITE_URL` vide ou mettez:
\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### En production (Vercel)
\`\`\`
NEXT_PUBLIC_SITE_URL=https://votre-app.vercel.app
\`\`\`

## Configuration Supabase

1. Exécutez le script SQL: `scripts/000_setup_all_tables.sql`
2. Configurez les URL de redirection dans Supabase:
   - Dashboard > Auth > URL Configuration
   - Ajoutez: `https://votre-app.vercel.app/auth/callback`
   - Ajoutez: `http://localhost:3000/auth/callback` (pour dev)

## Fonctionnalités

- Authentification complète (signup, login, reset password)
- Gestion de portefeuille Nkap
- Création et gestion de tontines
- Système de vote pour le bureau
- Tirage au sort automatique
- Chat de groupe
- Rapports financiers
- Multi-devises (XAF, NGN, KES, etc.)

## Architecture

- Next.js 16 avec App Router
- Supabase pour l'authentification et la base de données
- Server Actions pour toutes les mutations
- Row Level Security (RLS) activée
- Design avec Poppins et couleurs africaines
