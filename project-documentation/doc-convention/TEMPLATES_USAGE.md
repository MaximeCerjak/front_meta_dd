# **Utilisation des Templates d'Issues et de Merge Requests**

Ce guide explique comment utiliser les templates d'issues et de merge requests disponibles dans le dépôt **project-documentation** pour standardiser et faciliter la gestion des tâches et des contributions.

---

## **1. Accéder aux Templates d’Issues**

Les templates d'issues sont centralisés dans ce projet sous le répertoire `.gitlab/issue_templates/`. Ces templates vous aident à créer des tickets clairs et uniformes pour différents types de besoins.

### **Liste des Templates Disponibles**

- **Bug Report** (`bug.md`) : Pour signaler un problème ou un comportement inattendu.
- **Feature Request** (`feature_request.md`) : Pour proposer une nouvelle fonctionnalité.
- **Task Template** (`task.md`) : Pour décrire une tâche à accomplir.
- **Documentation Template** (`documentation.md`) : Pour demander ou structurer une documentation.
- **Hotfix Template** (`hotfix.md`) : Pour corriger un problème urgent.
- **Design/UX Feedback** (`design_feedback.md`) : Pour donner un retour sur un design ou un aspect UX.

---

### **2. Utiliser un Template d’Issue dans un Projet**

1. **Étape 1 : Copier les Templates**

    - Allez dans le répertoire `.gitlab/issue_templates/` de ce dépôt.
    - Téléchargez les fichiers de template que vous souhaitez utiliser.
    - Ajoutez-les dans le projet où ils seront utilisés, sous le répertoire :  
        `.gitlab/issue_templates/`.
2. **Étape 2 : Créer une Issue avec un Template**

    - Ouvrez le projet dans GitLab.
    - Cliquez sur **Issues > New Issue**.
    - Dans le menu déroulant **Use a template**, sélectionnez le template approprié.

---

## **3. Utiliser un Template de Merge Request**

Les templates de merge requests sont disponibles dans le répertoire `.gitlab/merge_request_templates/`.

### **Étape pour Utiliser un Template de MR**

1. **Étape 1 : Copier le Template**
    - Copiez le fichier `merge_request.md` dans le projet cible, sous le répertoire :  
        `.gitlab/merge_request_templates/`.
2. **Étape 2 : Créer une Merge Request**
    - Allez dans le projet, puis cliquez sur **Merge Requests > New Merge Request**.
    - Une fois que la MR est prête, GitLab proposera automatiquement le template à utiliser.

---

## **4. Ajouter ou Modifier des Templates**

### **Étape 1 : Ajouter un Nouveau Template**

1. Créez un fichier `.md` pour votre nouveau template dans le répertoire approprié :
    - Pour les issues : `.gitlab/issue_templates/`
    - Pour les MR : `.gitlab/merge_request_templates/`
2. Suivez la structure des templates existants pour garantir la cohérence.

### **Étape 2 : Mettre à Jour un Template**

1. Modifiez le fichier `.md` correspondant dans ce dépôt **project-documentation**.
2. Synchronisez les templates mis à jour dans les autres projets (manuellement ou avec un script CI/CD).

---

## **5. Bonnes Pratiques pour l’Utilisation des Templates**

- **Choisissez le bon template** : Sélectionnez le template correspondant au type de ticket ou de contribution (bug, feature, documentation, etc.).
- **Soyez précis** : Remplissez toutes les sections du template pour fournir des informations claires et complètes.
- **Respectez les standards** : Suivez les instructions du template pour éviter des retours inutiles pendant les revues.
- **Mettez à jour les templates régulièrement** : Vérifiez que les templates restent alignés avec les besoins du projet.

---

## **6. Ressources et Références**

- Documentation GitLab : [Personnalisation des templates d’issues](https://docs.gitlab.com/ee/user/project/description_templates.html)
- Répertoire des templates : `.gitlab/issue_templates/` et `.gitlab/merge_request_templates/`

---

## **Exemple d'Utilisation**

### **Créer une Issue pour un Bug**

1. Allez dans **Issues > New Issue** dans votre projet.
2. Sélectionnez le template **Bug Report** dans le menu déroulant.
3. Remplissez les sections :
    - **Description du problème**
    - **Étapes pour reproduire**
    - **Logs/erreurs**
4. Soumettez l’issue.
