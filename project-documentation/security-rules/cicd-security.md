# **Sécurisation des Pipelines CI/CD**

## **1. Objectif**

Ce document présente les bonnes pratiques pour sécuriser les pipelines CI/CD, afin de protéger le code, les secrets, et les systèmes déployés contre les accès non autorisés ou les vulnérabilités.

---

## **2. Bonnes Pratiques Générales**

### **2.1 Utiliser des Runners Sécurisés**

- Configurez des **runners privés** pour limiter l’accès aux ressources de build.
- Pour les runners partagés :
  - Restreignez leur utilisation à des projets non sensibles.
  - Ajoutez des règles pour limiter les jobs malveillants.

### **2.2 Gérer les Secrets de Manière Sécurisée**

- Stockez les secrets dans des variables protégées (GitLab CI/CD, GitHub Actions, etc.).
- N’intégrez jamais de secrets directement dans le code ou les scripts.

### **2.3 Restreindre les Permissions**

- Limitez les accès aux pipelines CI/CD aux membres autorisés uniquement.
- Configurez des branches protégées pour les environnements critiques (ex. : `main`, `release/*`).

### **2.4 Vérifier les Dépendances**

- Scannez les dépendances pour détecter les vulnérabilités avant le déploiement.
- Intégrez des outils comme **Dependabot**, **Snyk**, ou **Trivy** dans le pipeline.

---

## **3. Gestion des Secrets dans CI/CD**

### **3.1 Variables d’Environnement Sécurisées**

- Ajoutez les secrets comme variables protégées dans le CI/CD.
- Exemple dans GitLab CI/CD :
  - Allez dans **Settings > CI/CD > Variables**.
  - Ajoutez des variables avec l’option **Masked** (masquées).

Exemple de script utilisant une variable sécurisée :

```yaml
deploy:
  script:
    - echo "Utilisation de la clé API : $API_KEY"
```

### **3.2 Rotation des Secrets**

- Changez régulièrement les clés et mots de passe critiques utilisés par le pipeline.
- Révoquez immédiatement tout secret compromis.

---

## **4. Validation et Vérifications**

### **4.1 Analyse Statique de Sécurité**

- Intégrez des outils de scan de code pour détecter les failles avant le déploiement.
- Outils recommandés :
  - **SonarQube** : Analyse statique du code.
  - **Bandit** (Python) : Vérification des failles courantes.

Exemple d’étape dans un pipeline GitLab :

```yaml
code_quality:
  stage: test
  script:
    - sonar-scanner
```

### **4.2 Analyse des Images Docker**

- Scannez les images Docker pour identifier les vulnérabilités.
- Utilisez des outils comme Trivy ou Clair.

Exemple avec Trivy dans un pipeline CI/CD :

```yaml
scan_image:
  stage: test
  script:
    - trivy image my-image:latest
```

## **5. Sécurisation des Déploiements**

### **5.1 Déployer sur des Environnements Sécurisés**

- Limitez les permissions des comptes de service utilisés pour les déploiements.
- Configurez des règles strictes pour les environnements de production (ex. : accès lecture seule).

### **5.2 Vérifications Post-Déploiement**

- Validez que les services déployés sont sécurisés après chaque pipeline.
- Automatisez les tests de sécurité pour les environnements en production.

---

## **6. Audits et Journalisation**

### **6.1 Journalisation des Pipelines**

- Enregistrez toutes les actions dans le pipeline CI/CD pour faciliter les audits.
- Vérifiez régulièrement les logs pour identifier des anomalies.

### **6.2 Surveillance des Runners**

- Analysez les métriques des runners pour détecter des comportements suspects.
- Définissez des alertes pour les builds anormalement longs ou les jobs inattendus.

---

## **7. Outils Recommandés**

1. **Analyse des Dépendances** :
    - **Snyk** : Scanne et signale les vulnérabilités des dépendances.
    - **Dependabot** : Propose automatiquement des mises à jour de dépendances.
2. **Sécurité des Images Docker** :
    - **Trivy** : Analyse des vulnérabilités dans les images Docker.
    - **Clair** : Outil open-source pour scanner les conteneurs.
3. **Monitoring des Pipelines** :
    - **Datadog** : Surveille les pipelines et les runners.
    - **Splunk** : Collecte et analyse les logs des pipelines.

---

## **8. Checklist pour des Pipelines Sécurisés**

- [ ]  Les runners partagés sont limités ou remplacés par des runners privés.
- [ ]  Les secrets sont stockés dans des variables sécurisées et masquées.
- [ ]  Les pipelines incluent une étape de scan de sécurité (code, dépendances, conteneurs).
- [ ]  Les branches protégées empêchent les modifications non autorisées en production.
- [ ]  Les journaux des pipelines sont analysés régulièrement.
