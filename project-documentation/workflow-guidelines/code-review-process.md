# **Processus de Revue de Code**

## **1. Objectif**

La revue de code est une étape clé du processus de développement. Elle permet :

- De garantir la qualité et la lisibilité du code.
- D’identifier et corriger les erreurs avant la fusion.
- De partager les connaissances techniques au sein de l’équipe.

---

## **2. Étapes de la Revue de Code**

### **2.1 Avant de Soumettre une Merge Request**

L’auteur du code doit :

- Vérifier que le code suit les **conventions de codage** établies.
- S’assurer que les **tests passent localement** et que le pipeline CI/CD est en réussite.
- Rédiger une **description claire et concise** de la Merge Request (MR), comprenant :
  - Les changements réalisés.
  - L’impact attendu (ex. : nouvelles fonctionnalités, corrections de bugs).
  - Les références aux issues ou tickets associés (ex. : `Closes #123`).

---

### **2.2 Processus de Revue**

1. **Assignation** : L’auteur assigne un ou plusieurs reviewers à la Merge Request.
2. **Analyse du Code** : Le relecteur lit attentivement le code pour :
    - Vérifier la lisibilité et la logique.
    - Identifier les erreurs potentielles ou les failles.
    - Assurer que le code suit les conventions de codage.
3. **Tests Fonctionnels** :
    - Exécutez le code si possible pour valider son fonctionnement.
    - Vérifiez les cas limites et les scénarios non documentés.
4. **Retour Constructif** :
    - Fournissez des commentaires précis et constructifs (ex. : "Il serait préférable de...").
    - Proposez des solutions lorsque vous identifiez des problèmes.

---

## **3. Checklist pour les Relecteurs**

Avant d’approuver une Merge Request, vérifiez les points suivants :

- [ ]  **Qualité du Code** : Le code est lisible, clair et suit les conventions.
- [ ]  **Fonctionnalité** : La fonctionnalité ajoutée ou corrigée fonctionne comme attendu.
- [ ]  **Tests** : Les tests couvrent tous les cas critiques et passent avec succès.
- [ ]  **Impact** : Aucun code inutile ou non testé n'est inclus.
- [ ]  **Sécurité** : Les données sensibles sont bien protégées et aucun secret n’est exposé.

---

## **4. Checklist pour l’Auteur**

Avant de soumettre une Merge Request :

- [ ]  Mon code est testé localement et passe tous les tests.
- [ ]  Mon code respecte les conventions de codage définies.
- [ ]  J’ai rédigé une description claire pour la Merge Request.
- [ ]  J’ai référencé les issues associées dans la Merge Request (ex. : `Closes #123`).

---

## **5. Outils Recommandés pour la Revue**

- **GitLab Merge Requests** : Utilisez l’interface GitLab pour commenter directement dans le code.
- **ESLint/Prettier** : Les outils d’analyse statique permettent de détecter les erreurs de style avant la revue.
- **Tests Automatisés** : Le pipeline CI/CD garantit que le code fonctionne avant la revue.

---

## **6. Bonnes Pratiques**

- **Soyez constructif** : Proposez des solutions et encouragez les contributions positives.
- **Communiquez clairement** : Utilisez des commentaires précis et évitez les critiques vagues.
- **Posez des questions** : Si vous ne comprenez pas une partie du code, demandez des clarifications.
- **Respectez les délais** : Les reviewers doivent répondre rapidement pour ne pas bloquer le développement.

---

## **7. Processus d’Approbation**

1. Une fois tous les commentaires résolus, le relecteur peut approuver la Merge Request.
2. Le code est fusionné dans la branche cible (`develop` ou `main`), selon les règles établies.
