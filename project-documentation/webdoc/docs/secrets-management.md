# Gestion des Secrets

## **Objectif**

Ce document fournit des bonnes pratiques et des outils pour gérer les secrets dans vos projets, notamment les clés API, mots de passe, certificats, et autres informations sensibles. Une gestion sécurisée des secrets est essentielle pour protéger les données et les services contre les accès non autorisés.

## **Bonnes Pratiques**  

### **Ne Jamais Inclure les Secrets dans le Code Source**

- Utilisez des fichiers dédiés, comme `.env`, pour stocker les secrets localement.
- Ajoutez ces fichiers à `.gitignore` pour éviter qu’ils ne soient versionnés.

### **Chiffrez les Secrets Sensibles**

- Utilisez des outils comme **gpg** ou **sops** pour chiffrer les secrets avant de les stocker ou de les partager.
- Stockez les secrets chiffrés dans le dépôt uniquement si nécessaire.

### **Centralisez les Secrets avec des Gestionnaires de Secrets**

- Utilisez des solutions éprouvées pour centraliser et gérer les secrets :
- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**

### **Rotation Régulière des Secrets**

- Changez régulièrement les clés API, certificats et mots de passe critiques.
- Configurez des alertes pour les secrets arrivant à expiration.

### **Restreignez les Permissions**

- Limitez l’accès aux secrets au strict nécessaire :
  - Utilisez des rôles et politiques dans les gestionnaires de secrets.
  - Configurez des permissions spécifiques par environnement (dev, staging, prod).  

## **Gestion des Secrets dans les Environnements**

### **Variables d’Environnement**

Utilisez des variables d’environnement pour injecter les secrets dans les applications.  Exemple d’un fichier `.env` :

```yaml
DB_PASSWORD=supersecretdatabasepassword 
API_KEY=abc123xyz
```

Accès dans le code :

```javascript
const apiKey = process.env.API_KEY;
```

### **Gestion dans CI/CD**

1. Allez dans **GitLab > Settings > CI/CD > Variables**.
2. Ajoutez les secrets directement dans l’interface GitLab en tant que variables protégées.
3. Référez-vous à ces variables dans vos pipelines.

Exemple de pipeline `.gitlab-ci.yml` :

```yaml
stages:   
    - deploy  
deploy:   
    script:     
        - echo "Déploiement avec la clé API : $API_KEY"
```

## **Bonnes Pratiques de Sécurisation**

### **Détecter les Secrets dans le Code**

- Utilisez des outils comme **GitLeaks** ou **TruffleHog** pour scanner le dépôt à la recherche de secrets accidentellement commis.

### **Révoquer Immédiatement les Secrets Exposés**

- Si un secret est accidentellement publié, considérez-le comme compromis.
- Révoquez immédiatement le secret concerné et remplacez-le.

### **Isolation des Environnements**

- Chaque environnement (développement, staging, production) doit utiliser ses propres secrets.
- Ne partagez pas les secrets entre environnements.

## **Outils Recommandés**

1. **Gestionnaires de Secrets** :
    - AWS Secrets Manager : Intégré avec les services AWS.
    - HashiCorp Vault : Solution open-source pour gérer les secrets.
    - Doppler : Gestion simplifiée des secrets pour les équipes.

2. **Analyse des Secrets** :

    - **GitLeaks** : Détecte les secrets dans les dépôts Git.
    - **TruffleHog** : Scanne les dépôts pour trouver des clés API ou autres données sensibles.

3. **Chiffrement** :

    - **Sops** : Chiffre les fichiers YAML, JSON, ou autres fichiers de configuration.
    - **OpenSSL** : Outil en ligne de commande pour le chiffrement.

## **Checklist pour une Gestion Sécurisée des Secrets**

- [ ]  Aucun secret n’est présent dans le code source ou les logs.
- [ ]  Les secrets sont centralisés dans un gestionnaire sécurisé.
- [ ]  Les permissions d’accès aux secrets sont configurées de manière stricte.
- [ ]  Les secrets sont régulièrement rotés et révoqués si compromis.
- [ ]  Les variables d’environnement sont utilisées pour injecter les secrets dans les applications.
