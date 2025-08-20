# Dockerfile pour développement
FROM node:18

WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3001 (port par défaut de Docusaurus)
EXPOSE 3001

# Commande par défaut pour démarrer le service en mode développement
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "3001"]