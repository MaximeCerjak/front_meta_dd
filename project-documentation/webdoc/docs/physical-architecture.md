# Architecture Physique

L'architecture physique du projet repose sur un cluster de Raspberry Pi configuré pour maximiser l'efficacité et la résilience, tout en s'adaptant aux contraintes de ressources matérielles limitées. Ce document détaille la disposition matérielle, les infrastructures réseau, et les options de stockage partagé.

## **Cluster de Raspberry Pi**

**Diagramme d'infrastructure**:

![Cluster Raspberry Pi](/img/doc/infra.png)

### **Master Node**

Le master node joue un rôle central dans l'orchestration du système et l'hébergement des services critiques :

- **Matériel recommandé** : Raspberry Pi 4 avec 4 à 8 Go de RAM.
- **Rôles principaux** :
  - Orchestration des microservices via Docker Swarm ou Kubernetes (K3s).
  - Hébergement des outils de monitoring (Prometheus, Grafana).
  - Gestion des déploiements et des configurations réseau.

### **Worker Nodes**

Les worker nodes exécutent les conteneurs applicatifs :

- **Matériel recommandé** : Raspberry Pi 3B+ ou 4 avec au moins 2 Go de RAM.
- **Rôles principaux** :
  - Exécution des services applicatifs (frontend, backend, base de données).
  - Répartition de la charge de travail pour garantir la scalabilité.

### **Stockage Partagé**

Pour permettre un accès partagé aux données utilisateurs et aux fichiers d’exposition :

- **Options de stockage** :
  - **NFS (Network File System)** : Simple à configurer pour un réseau local.
  - **GlusterFS** : Système distribué adapté à des clusters plus importants.
- **Utilisation** :
  - Stockage des fichiers d’exposition (images, vidéos, etc.).
  - Sauvegarde des données critiques.

## **Infrastructure Réseau**

### **Connexion Locale**

Le cluster repose sur une infrastructure réseau local robuste :

- **Switch Gigabit** : Réduction de la latence et augmentation de la bande passante.
- **Wi-Fi** : Utilisation possible d'un point d’accès local pour une configuration sans fil.

### **Gestion des IP**

- **Attribution statique** : Simplifie la gestion des connexions et la maintenance du réseau.
- **DHCP avec réservations** : Alternative pour attribuer des IP fixes via un routeur.

### **Accès Externe Sécurisé**

Pour accéder au cluster à distance :

- **VPN (WireGuard)** :
  - Accès sécurisé au réseau local via une connexion chiffrée.
  - Protège les communications externes.
- **Restrictions SSH** :
  - Accès limité aux IP approuvées.
  - Authentification par clé SSH pour renforcer la sécurité.

## **Références et Ressources**

- [Docker Swarm sur un cluster de Raspberry Pi](https://blog.raspot.in/fr/blog/side-project-mise-en-place-de-docker-swarm-sur-un-cluster-de-raspberry-pi?utm_source=chatgpt.com)
- [Infrastructure de cluster informatique avec Raspberry Pi](https://www.raspberrypi-france.fr/infrastructure-de-cluster-informatique-avec-raspberry-pi-elements-de-base-et-deploiement/?utm_source=chatgpt.com)
- [Etude, conception et implémentation d'un cluster low-cost haut disponibilité de Raspberry Pi 3](https://www.memoireonline.com/01/20/11481/Etude-conception-et-implementation-d-un-cluster-low-cost-haut-disponibilite-de-Raspberry-Pi-3.html?utm_source=chatgpt.com)
