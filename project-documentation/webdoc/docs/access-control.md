# Gestion des Accès et Permissions

## **Objectif**

Ce document décrit les bonnes pratiques pour gérer les accès et permissions aux systèmes, services, et données sensibles. Une gestion efficace des permissions est cruciale pour protéger les ressources contre les accès non autorisés.

## **Bonnes Pratiques**

### **Appliquer le Principe du Moindre Privilège**

- Assurez-vous que chaque utilisateur ou service dispose uniquement des permissions nécessaires pour accomplir ses tâches.
- Évitez d'accorder des rôles administratifs à moins que cela ne soit strictement nécessaire.

### **Authentification Renforcée**

- Activez l'authentification à deux facteurs (2FA) pour tous les comptes critiques, notamment ceux ayant accès à la production.
- Préférez des solutions SSO (Single Sign-On) pour centraliser et sécuriser les accès.

### **Audits Périodiques**

- Passez en revue les permissions des utilisateurs tous les 3 mois.
- Révoquez les accès des membres ayant quitté l'équipe ou changé de rôle.

### **Journalisation des Accès**

- Activez la journalisation pour tous les accès aux systèmes critiques.
- Analysez régulièrement les logs pour détecter des activités suspectes.

## **Gestion des Accès dans GitLab**

### **Rôles et Permissions**

- **Guest** : Accès limité, principalement en lecture sur les dépôts publics.
- **Reporter** : Peut accéder aux issues et aux pipelines, mais pas pousser de code.
- **Developer** : Peut pousser du code et travailler sur des branches de fonctionnalités.
- **Maintainer** : Peut fusionner dans `main` et configurer les pipelines CI/CD.
- **Owner** : Gestion complète du projet et des permissions.

### **Configurations Recommandées**

- Attribuez les rôles **Maintainer** uniquement aux responsables techniques ou chefs de projet.
- Limitez les permissions des **Developers** aux branches sur lesquelles ils travaillent.

## **Contrôle des Accès aux Environnements**

### **Accès par Environnement**

- **Développement** :
  - Accès étendu pour les développeurs, mais pas de données sensibles.
- **Staging** :
  - Accès restreint aux développeurs et autorisation pour les tests finaux.
- **Production** :
  - Accès limité aux Maintainers et Administrateurs uniquement.

### **Permissions sur les Secrets**

- Configurez les secrets en fonction des rôles et environnements.
- Exemples dans GitLab CI/CD :
  - **Variables Protégées** : Variables accessibles uniquement aux branches protégées (`main`, `release/*`).
  - **Environnement Variables** :
    - Production : Accessible uniquement par des runners spécifiques.

## **Bonnes Pratiques pour les Systèmes Externes**

1. **Gestion des Clés API** :
   - Assignez des permissions spécifiques à chaque clé API (ex. : lecture seule, écriture).
   - Révoquez immédiatement les clés compromises.

2. **Contrôle des Accès sur les Bases de Données** :
   - Créez des comptes spécifiques avec des permissions minimales (ex. : accès lecture pour les rapports).
   - Ne partagez jamais les comptes administrateurs.

3. **Gestion des Droits des Applications** :
   - Utilisez des rôles IAM pour gérer les permissions dans des systèmes cloud comme AWS, Azure, ou GCP.
   - Attribuez des rôles spécifiques à chaque application ou service.

## **Outils Recommandés**

1. **IAM (Identity and Access Management)** :
   - AWS IAM, Azure AD, ou Google IAM pour gérer les accès aux services cloud.
   - Keycloak pour les solutions open source de gestion d’identité.

2. **Audit et Monitoring** :
   - **Datadog** : Pour surveiller les accès et comportements suspects.
   - **Splunk** : Analyse approfondie des logs.

3. **Gestion des Accès Git** :
   - **GitLab Permissions** : Configurez les rôles et permissions directement dans GitLab.
   - **Git Hooks** : Implémentez des restrictions personnalisées sur les dépôts.

## **Checklist pour une Gestion Sécurisée des Accès**

- [ ] Les rôles et permissions sont configurés selon le principe du moindre privilège.
- [ ] Les comptes inutilisés sont régulièrement désactivés ou supprimés.
- [ ] L'authentification à deux facteurs est activée pour tous les comptes critiques.
- [ ] Les accès aux systèmes externes et internes sont journalisés.
- [ ] Les accès sont audités tous les 3 mois.
