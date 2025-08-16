
# Chatbot-Service avec GPT-4

Ce projet implémente un **chatbot intelligent** en utilisant le modèle **GPT-4** d'OpenAI. Ce chatbot permet de répondre à des requêtes textuelles complexes et fournit des réponses cohérentes et contextualisées grâce à l'intégration de l'API OpenAI.

---

## 📚 Fonctionnalités

- **Modèle GPT-4** : Utilisation de l'API OpenAI pour générer des réponses intelligentes.
- **Structure modulaire** : Organisation claire des fichiers pour faciliter la maintenance et l'extension.
- **Extensibilité** : Facile à enrichir avec des fonctionnalités comme la gestion de l'historique des conversations ou des interactions vocales.
- **Flexibilité** : Support des paramètres avancés de l'API OpenAI pour personnaliser les réponses.

---

## 🔧 Installation

### 1️⃣ Prérequis

Assurez-vous d'avoir les éléments suivants :

- **Node.js** : Version 14 ou supérieure.
- **npm** : Version 6 ou supérieure.
- **Clé API OpenAI** : Disponible sur [OpenAI Platform](https://platform.openai.com/).

### 2️⃣ Étapes d'installation

1. **Cloner le projet :**
   ```bash
   git clone <URL-du-repository>
   cd chatbot-service
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement :**
   Créez un fichier **`.env`** à la racine avec le contenu suivant :
   ```env
   PORT=3000
   OPENAI_API_KEY=VotreCléAPI
   ```

4. **Démarrer le serveur :**
   En mode développement :
   ```bash
   npm run dev
   ```

   En mode production :
   ```bash
   npm start
   ```

---

## 🧪 Tester le Chatbot

### 1️⃣ Démarrage du serveur
Une fois le serveur démarré, il sera disponible sur **http://localhost:3000**.

### 2️⃣ Tester une requête via Postman ou curl

#### Exemple de requête
- **URL** : `http://localhost:3000/api/chat`
- **Méthode** : `POST`
- **Corps (JSON)** :
  ```json
  {
    "prompt": "Qu'est-ce que l'intelligence artificielle ?"
  }
  ```

#### Exemple de réponse
```json
{
  "response": "L'intelligence artificielle (IA) est une branche de l'informatique qui se concentre sur la création de systèmes capables d'accomplir des tâches nécessitant normalement l'intelligence humaine..."
}
```

---

## 🛠️ Paramètres de l'API GPT-4

Voici les principaux paramètres configurés pour interagir avec l'API OpenAI :

| **Paramètre**      | **Description**                                                                 | **Valeur utilisée** |
|---------------------|---------------------------------------------------------------------------------|---------------------|
| **`model`**         | Modèle utilisé pour la génération.                                              | `"gpt-4"`          |
| **`messages`**      | Historique des messages (contexte de conversation).                            | `[ ... ]`          |
| **`max_tokens`**    | Nombre maximum de jetons dans la réponse.                                       | `300`              |
| **`temperature`**   | Contrôle la créativité des réponses (0 = déterministe, 1 = très créatif).        | `0.7`              |
| **`top_p`**         | Contrôle la diversité des mots générés.                                         | `1.0`              |

---

## ✨ Fonctionnalités avancées

Voici des améliorations possibles pour enrichir le projet :

1. **Gestion de l'historique des conversations** :
   - Ajout d'une base de données pour stocker les messages échangés entre l'utilisateur et le chatbot.
   - Utilisation des messages précédents pour conserver le contexte d'une conversation.

2. **Interface utilisateur** :
   - Développement d'un frontend interactif (par exemple avec React ou Vue.js) pour interagir avec le chatbot.

3. **Options personnalisées** :
   - Ajout de paramètres dans la requête pour configurer la température, la longueur des réponses, etc.

4. **Support vocal** :
   - Intégration d'un service de synthèse vocale pour rendre les réponses audio.

---

## 📌 Bonnes pratiques

1. **Protégez votre clé API** :
   - Ne partagez jamais votre clé dans le code source ou publiquement.
   - Utilisez des variables d'environnement pour sécuriser les données sensibles.

2. **Surveillez vos usages** :
   - Vérifiez votre consommation sur le tableau de bord OpenAI pour éviter des coûts imprévus.

3. **Limiter les prompts** :
   - Validez les entrées utilisateur pour éviter les prompts inutiles ou malveillants.

---

## 🛡️ Dépendances principales

- **[express](https://expressjs.com/)** : Framework web rapide et minimaliste.
- **[openai](https://www.npmjs.com/package/openai)** : SDK officiel pour interagir avec l'API OpenAI.
- **[dotenv](https://www.npmjs.com/package/dotenv)** : Gestion des variables d'environnement.
- **[nodemon](https://www.npmjs.com/package/nodemon)** : Redémarrage automatique du serveur en développement.

---

