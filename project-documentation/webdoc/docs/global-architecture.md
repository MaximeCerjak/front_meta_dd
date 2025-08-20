# Architecture du Projet

Ce document présente l'architecture globale du projet, qui repose sur une approche modulaire et évolutive. Le projet est structuré autour d'un cluster Raspberry Pi et d'une architecture logicielle en microservices. Chaque aspect de l’architecture est détaillé dans des fichiers spécialisés, décris ci dessous.

## **Vue d’ensemble**

### **Architecture physique**

Le système est déployé sur un cluster de Raspberry Pi, utilisant des connexions Ethernet ou Wi-Fi pour une infrastructure extensible.

### **Architecture logique**

L'architecture logicielle est organisée en microservices pour garantir la modularité et la scalabilité.
Chaque composant (frontend, backend, base de données) est conteneurisé pour faciliter le déploiement.

### **Orchestration et déploiement**

Les services sont orchestrés à l’aide de Docker Compose en développement local et Kubernetes (K3s) en production.
Un système de monitoring assure la performance et la stabilité.

### **Flux de données**

Le projet repose sur des interactions fluides entre le frontend, le backend, et la base de données via REST API, SQL, et WebSocket.

### **Sécurité**

Des mesures avancées (TLS, tokens JWT, firewalls) garantissent la protection des données et des communications.

## **Liens vers les sections détaillées**

- [Architecture Physique](physical-architecture) :
  Organisation matérielle, cluster Raspberry Pi, réseau local.

- [Architecture Logique](logical-architecture) :
  Structure des composants logiciels et technologies utilisées.

- [Orchestration et Déploiement](deployment-orchestration) :
  Processus de conteneurisation et de mise en production.

- [Flux de Données](data-flows) :
  Interactions entre les composants et protocoles utilisés.

- [Sécurité](security) :
  Stratégies pour sécuriser le réseau, les services et les données.
