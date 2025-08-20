# **Instructions pour les Merge Requests**

## **1. Objectif**

Standardiser le processus de création et de gestion des Merge Requests (MR) pour garantir la qualité du code et faciliter la collaboration.

---

## **2. Création d’une Merge Request**

### **2.1 Préparation**

Avant de créer une Merge Request, assurez-vous que :

- [ ] Votre branche est basée sur la branche correcte (ex. : `develop` ou `main`).
- [ ] Votre code est testé localement.
- [ ] Le pipeline CI/CD a été exécuté avec succès.

### **2.2 Étapes pour Créer une MR**

1. **Naviguez vers le projet** dans GitLab.
2. **Allez dans la section Merge Requests** et cliquez sur "New Merge Request".
3. **Sélectionnez la branche source et la branche cible** :
   - Source : La branche sur laquelle vous avez travaillé.
   - Cible : Habituellement `develop` ou `main`, selon le workflow.
4. **Rédigez un titre clair et concis** :
   - Exemple : `Feature: Add user authentication`.
5. **Ajoutez une description complète** :
   - Expliquez ce que fait la MR.
   - Référencez les issues associées (ex. : `Closes #123`).
6. **Ajoutez des reviewers et assignez la MR** :
   - Sélectionnez les membres de l’équipe pour examiner votre code.

---

## **3. Checklist pour l’Auteur**

Avant de soumettre une Merge Request, vérifiez les points suivants :

- [ ] Mon code est lisible et suit les conventions de style.
- [ ] Tous les tests passent localement et dans le pipeline CI/CD.
- [ ] J’ai inclus des tests unitaires pour les fonctionnalités ajoutées ou modifiées.
- [ ] La description de la MR est complète et précise.

---

## **4. Checklist pour les Reviewers**

Lors de la revue d’une Merge Request, assurez-vous que :

- [ ] Le code est fonctionnel et respecte les standards.
- [ ] Les modifications n'introduisent pas de régressions.
- [ ] Les tests automatisés couvrent bien les nouvelles fonctionnalités ou corrections.
- [ ] Les secrets ou données sensibles ne sont pas exposés dans le code.

---

## **5. Bonnes Pratiques**

- **Commits Squashés** :
  - Si possible, combinez plusieurs petits commits en un seul avant de fusionner.
- **Discussions dans les Commentaires** :
  - Utilisez les outils GitLab pour commenter directement dans le code.
  - Résolvez les discussions avant d’approuver la MR.
- **Assurez une Communication Claire** :
  - Si vous rejetez une MR, expliquez clairement pourquoi et proposez des améliorations.

---

## **6. Approche Automatisée avec CI/CD**

- Toutes les Merge Requests doivent passer par le pipeline CI/CD.
- Le pipeline exécute les étapes suivantes :
  1. **Tests Unitaires**.
  2. **Linting** pour les conventions de style.
  3. **Build** si applicable.

---

## **7. Processus de Fusion**

1. Une fois approuvée, fusionnez la MR via l’interface GitLab.
2. Supprimez la branche source si elle n’est plus nécessaire.
3. Vérifiez que le pipeline post-merge passe avec succès.
