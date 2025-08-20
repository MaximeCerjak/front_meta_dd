# **Conventions de Codage**

## **1. Objectif**

Cette documentation définit les standards de codage à respecter dans tous les projets afin d'assurer :

- Une meilleure lisibilité.
- Une cohérence entre les membres de l'équipe.
- Une facilité de maintenance à long terme.

Les outils de vérification et de formatage sont **déjà configurés dans le pipeline CI/CD** et ne nécessitent aucune action supplémentaire de la part des développeurs. Reportez-vous à la documentation sur l'installation de l'environnement de travail pour plus de détails.

---

## **2. Indentation**

- Utilisez **2 espaces** pour l’indentation.
- Évitez les **tabulations** pour garantir une uniformité dans tous les environnements.

---

## **3. Nommage**

### **Variables**

- Utilisez le style **camelCase** pour nommer vos variables (ex. : `userName`, `totalPrice`).

### **Fonctions**

- Utilisez également le **camelCase** pour nommer vos fonctions (ex. : `getUserData()`).

### **Classes**

- Utilisez le style **PascalCase** pour nommer vos classes (ex. : `UserManager`, `OrderProcessor`).

### **Constantes**

- Les constantes doivent être écrites en **UPPER_SNAKE_CASE** (ex. : `MAX_RETRIES`, `DEFAULT_TIMEOUT`).

---

## **4. Structure du Code**

- Placez tous les **imports** ou **requires** au début du fichier.
- Groupez les déclarations logiquement : constantes, variables, fonctions, exportations.
- Limitez la longueur des lignes à **80 caractères**.

---

## **5. Syntaxe**

- Toujours utiliser `const` ou `let`. **Ne jamais utiliser `var`.**
- Préférez les fonctions fléchées (`()=>`) sauf si une méthode de classe est nécessaire.
- Utilisez des **apostrophes simples** (`'`) pour les chaînes de caractères, sauf en cas d'imbrication.

---

## **6. Commentaires**

- Commentez les blocs de code complexes ou critiques.
- Utilisez le format **JSDoc** pour documenter les fonctions et méthodes publiques.

Exemple :

```javascript
/**  
 * Calcule la somme de deux nombres.  
 * @param {number} a - Premier nombre.  
 * @param {number} b - Deuxième nombre.  
 * @returns {number} La somme des deux nombres.  
 */ 
function add(a, b) {   
    return a + b; 
}
```

---

## **7. Gestion des Erreurs**

- Gérez les erreurs avec des blocs `try...catch` lorsque nécessaire.
- Fournissez des messages d'erreur explicites pour faciliter le débogage.

Exemple :

```javascript
try {   
    const data = JSON.parse(input); 
} catch (error) {  
    console.error('Erreur lors du parsing JSON :', error.message); 
}
```

---

## **8. Tests**

- Tout code produit doit être accompagné de **tests unitaires**.
- Les tests doivent couvrir les cas normaux, limites, et erreurs.
- Les tests sont exécutés automatiquement dans le pipeline CI/CD.

---

## **9. Vérifications Automatiques**

Les outils suivants sont utilisés pour garantir le respect des conventions de codage et sont configurés dans le pipeline CI/CD :

- **ESLint** : Vérification des règles de style et des bonnes pratiques.
- **Prettier** : Formatage automatique du code pour garantir l'uniformité.

Aucune action manuelle n'est requise de la part des développeurs : les vérifications s'exécutent automatiquement lors des commits et des merge requests.

Pour plus d'informations sur l'installation locale de ces outils, référez-vous à la documentation dédiée à l'installation de l'environnement de travail.
