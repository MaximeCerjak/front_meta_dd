# Conventions Git

Cette documentation vise à définir des conventions claires pour l'utilisation de Git dans les projets afin de garantir :

- Une gestion cohérente des branches.
- Un historique clair et utile.
- Une collaboration efficace entre les membres de l'équipe.

## **Organisation des Branches**

### **Branches Principales**

- **`main`** :
  - Contient le code stable, prêt pour la production.
  - Aucun développement direct ne doit être effectué sur `main`.
  - Seules les versions validées par le pipeline CI/CD doivent être fusionnées.
- **`develop`** :
  - Contient le dernier code en développement, destiné à être testé avant la fusion dans `main`.
  - Utilisé comme base pour créer des branches de fonctionnalités.

### **Branches Temporaires**

- **Feature branches** :
  - Utilisées pour développer de nouvelles fonctionnalités.
  - Nommage : `feature/<description>` (ex. : `feature/add-login`).
  - Basées sur la branche `develop`.
  - Supprimées après la fusion dans `develop`.
- **Hotfix branches** :
  - Utilisées pour corriger des bugs critiques en production.
  - Nommage : `hotfix/<description>` (ex. : `hotfix/fix-crash`).
  - Basées sur la branche `main`.
  - Fusionnées à la fois dans `main` et `develop`.
- **Release branches** :
  - Utilisées pour préparer une version stable avant la mise en production.
  - Nommage : `release/<version>` (ex. : `release/v1.2.0`).
  - Basées sur `develop`.
  - Fusionnées dans `main` et `develop` après validation.

## **Workflow Git**

### **Règles pour les Commits**

- Rédigr des messages de commit clairs et concis en anglais :
  - Ligne 1 : Résumé en 50 caractères maximum.
  - Ligne 2 : Une ligne vide.
  - Ligne 3 : Détails supplémentaires si nécessaire.

Exemple :

```css
Fix user login issue  

Resolved a bug where users were unable to login due to incorrect password hashing.
```

- Regrouper vos commits en unités logiques (pas de "Fix typo" à répétition).
- Préférer plusieurs petits commits plutôt qu'un énorme commit.

### **Processus de Merge**

- Les fusions vers `main` ou `develop` doivent se faire via une **Merge Request (MR)**.
- Toutes les MRs doivent :
  - Passer par une revue de code par au moins un autre développeur.
  - Réussir les tests automatisés dans le pipeline CI/CD.

### **Résolution de Conflits**

- Résoudre les conflits en local avant de soumettre une MR.
- Tester le code après chaque résolution pour garantir sa stabilité.

## **Versioning Sémantique**

Adopter le versioning sémantique pour les releases, au format `MAJOR.MINOR.PATCH` :

- **MAJOR** : Incrémenté pour des changements incompatibles ou majeurs.
- **MINOR** : Incrémenté pour des fonctionnalités ajoutées tout en restant rétrocompatibles.
- **PATCH** : Incrémenté pour des corrections de bugs sans ajout de nouvelles fonctionnalités.

Exemple :

```yaml
v1.0.0 : Première version stable. 
v1.1.0 : Ajout d’une nouvelle fonctionnalité (rétrocompatible). 
v1.1.1 : Correction de bugs.
```

## **Organisation des Repositories**

### **Multi-Repo vs Monorepo**

- **Multi-Repo** : Chaque composant ou microservice est isolé dans son propre dépôt. Idéal pour les architectures modulaires.
- **Monorepo** : Tous les services et composants sont regroupés dans un seul dépôt. Simplifie la gestion des dépendances internes.

#### **Choix pour le projet**

Le projet étant voué à devenir complexe, nous avons opté pour une approche **Multi-Repo**, un groupe de projet à été créé sur gitlab et contient les `repositories` de chaque service backend et frontend. Ce choix permet de mieux gérer les dépendances et de faciliter la maintenance à long terme.

### **Structuration des Repositories**

Pour chaque repository backend, respecter cette organisation minimale :

```bash
<repository-root>/ 
├── src/                # Code source 
│   ├── controllers/    # Contrôleurs 
│   ├── models/         # Modèles de données 
│   ├── routes/         # Définition des routes 
│   └── utils/          # Fonctions utilitaires 
├── tests/              # Tests unitaires et d'intégration 
├── .gitignore          # Liste des fichiers ignorés par Git 
├── README.md           # Documentation du projet 
└── package.json        # Dépendances (pour les projets Node.js)
```

Le repository frontend suit une structure standard pour faciliter la navigation et la maintenance du code : 

- **`src/`** : Contient le code source de l'application.
  - **`assets/`** : Images, polices, etc.
  - **`objects/`** : Objets de jeu personnalisés.
  - **`scenes/`** : Scènes de jeu.
  - **`services/`** : Services pour les appels API.
  - **`styles/`** : Fichiers de styles globaux.
  - **`utils/`** : Fonctions utilitaires.
- **`tests/`** : Contient les tests unitaires et d'intégration.
- **`.gitignore`** : Liste des fichiers et dossiers à ignorer.
- **`README.md`** : Documentation du projet.
- **`package.json`** : Fichier de configuration des dépendances (pour les projets Node.js).

## **Checklist pour les Merge Requests**

Avant de soumettre une MR :

- [ ]  Le code est fonctionnel et testé localement.
- [ ]  Le code suit les conventions de style définies.
- [ ]  Tous les commits sont bien écrits et regroupés logiquement.
- [ ]  Les tests automatisés passent avec succès.

## **Automatisation et CI/CD**

- Utilisation des outils **GitLab CI/CD** pour :
  - Exécuter automatiquement les tests unitaires à chaque push.
  - Valider que le code respecte les conventions.
  - Générer des artefacts de build pour les releases.

- Les pipelines sont configurées distinctement pour les branches `develop`, `release/*` et `main` :
  - **develop** : Tester et valider les nouvelles fonctionnalités.
  - **release/** : Préparer la version pour la production.
  - **main** : Déployer automatiquement les builds validés.
