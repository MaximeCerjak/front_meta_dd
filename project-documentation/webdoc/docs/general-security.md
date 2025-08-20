# Bonnes Pratiques Générales en Sécurité

Cette documentation présente des bonnes pratiques adaptées à un projet déployé dans un réseau privé, comme un cluster de Raspberry Pi dans une école. Le contexte implique un contrôle des accès réseau, des ressources limitées, et une gestion simplifiée de la sécurité, tout en garantissant une protection suffisante contre les risques internes et externes.

## **Objectifs de Sécurité**

1. Protéger les données sensibles (mots de passe, fichiers partagés, configurations critiques).
2. Réduire les risques d'accès non autorisé au cluster ou aux services.
3. Assurer la disponibilité et la stabilité des services face aux erreurs ou attaques internes.

## **Bonnes Pratiques Essentielles**

### **Cloisonnement Réseau**

- Configurer le cluster de Raspberry Pi dans un sous-réseau isolé, par exemple avec un VLAN dédié, pour empêcher l’accès depuis le reste du réseau.
- Activer un pare-feu sur chaque Raspberry Pi pour limiter les connexions aux services essentiels (ex. : ports HTTP/HTTPS pour le frontend, ports WebSocket).
- Bloquer l'accès externe direct. Autoriser uniquement les connexions entrantes depuis des adresses IP internes spécifiées.

### **Mise à Jour et Maintenance**

- Maintenir le système d'exploitation des Raspberry Pi à jour avec `apt update && apt upgrade`.
- Surveiller les dépendances des services pour détecter les vulnérabilités (ex. : `npm audit` pour Node.js).
- Utiliser des images Docker récentes pour les conteneurs backend et frontend.

### **Gestion des Accès**

- Désactiver l’accès par mot de passe et autoriser uniquement les connexions via des clés SSH.
- Restreindre les connexions SSH à des adresses IP internes spécifiques.
- Limiter les permissions des fichiers sensibles avec des commandes comme `chmod 600`.

### **Surveillance et Journalisation**

- Activer les journaux pour surveiller les accès au cluster et aux services (par exemple, les connexions HTTP). Éviter de loguer des informations sensibles (mots de passe, fichiers).
- Installer des outils légers comme **Netdata** ou **Telegraf** pour surveiller l’état des Raspberry Pi (charge CPU, espace disque).

### **Gestion des Secrets**

- Utiliser des fichiers `.env` pour stocker les secrets, sans les inclure dans les dépôts Git.
- Protéger ces fichiers avec des permissions restreintes (`chmod 600`).
- Envisager une solution comme **Vault by HashiCorp** pour la gestion des secrets critiques, même en local.

## **Bonnes Pratiques pour le Développement**

### **Validation des Entrées Utilisateurs**

- Valider systématiquement les données utilisateur avant leur traitement avec des bibliothèques comme **Joi** ou **Yup**.
- Rejeter toute donnée mal formée ou inattendue.

### **Sécurisation des Données Partagées**

- Chiffrer les fichiers uploadés avant de les stocker.
- Utiliser des chemins d’accès sécurisés pour prévenir les attaques de type _path traversal_.

### **Protection des Communications**

- Même en réseau privé, configurer un certificat auto-signé pour chiffrer les communications internes (HTTPS, WebSocket).
- Installer un proxy inversé léger (ex. : Nginx ou Traefik) pour centraliser la gestion du chiffrement.

## **Approches pour l'Infrastructure**

### **Conteneurisation Sécurisée**

- Utiliser Docker pour isoler les services. Chaque microservice doit disposer de son propre conteneur.
- Ne pas donner d’accès root aux conteneurs (utiliser des utilisateurs restreints).

### **Sauvegardes Automatisées**

- Configurer des sauvegardes régulières des données importantes (base PostgreSQL, fichiers utilisateurs) vers un stockage externe, en veillant à ce qu'elles soient chiffrées.

### **Scripts et Automatisation**

- Créer des scripts pour automatiser les mises à jour, déploiements et tâches de maintenance courantes.

## **Checklist pour un Cluster Privé**

- [ ]  Réseau isolé dans un VLAN ou sous-réseau séparé.
- [ ]  Accès SSH sécurisé avec clés uniquement.
- [ ]  Services exposés limités au strict nécessaire.
- [ ]  Mises à jour régulières des systèmes et dépendances.
- [ ]  Chiffrement activé pour les communications internes.
- [ ]  Journalisation activée sans inclure d'informations sensibles.
