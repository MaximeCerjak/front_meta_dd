# Coding Conventions

## **1. Objective**

This document defines the coding standards to be followed across all projects to ensure:

- Better readability.
- Consistency among team members.
- Ease of long-term maintenance.

Verification and formatting tools are **already configured in the CI/CD pipeline** and require no additional action from developers. Refer to the documentation on setting up the development environment for further details.

---

## **2. Indentation**

- Use **2 spaces** for indentation.
- Avoid **tabs** to ensure uniformity across all environments.

---

## **3. Naming**

### **Variables**

- Use **camelCase** for naming variables (e.g., `userName`, `totalPrice`).

### **Functions**

- Use **camelCase** for naming functions as well (e.g., `getUserData()`).

### **Classes**

- Use **PascalCase** for naming classes (e.g., `UserManager`, `OrderProcessor`).

### **Constants**

- Constants should be written in **UPPER_SNAKE_CASE** (e.g., `MAX_RETRIES`, `DEFAULT_TIMEOUT`).

---

## **4. Code Structure**

- Place all **imports** or **requires** at the top of the file.
- Group declarations logically: constants, variables, functions, exports.
- Limit line length to **80 characters**.

---

## **5. Syntax**

- Always use `const` or `let`. **Never use `var`.**
- Prefer arrow functions (`()=>`) unless a class method is required.
- Use **single quotes** (`'`) for strings, unless nested.

---

## **6. Comments**

- Comment complex or critical blocks of code.
- Use the **JSDoc** format to document public functions and methods.

Example:

```javascript
/**  
 * Calculates the sum of two numbers.  
 * @param {number} a - The first number.  
 * @param {number} b - The second number.  
 * @returns {number} The sum of the two numbers.  
 */ 
function add(a, b) {   
    return a + b; 
}
```

## **7. Error Handling**

- Handle errors using `try...catch` blocks when necessary.
- Provide explicit error messages to facilitate debugging.

Example:

```javascript
try {        
    const data = JSON.parse(input);  
} catch (error) {       
    console.error('Error parsing JSON:', error.message);  
}
```

---

## **8. Testing**

- All production code must be accompanied by **unit tests**.
- Tests must cover normal, edge, and error cases.
- Tests are automatically executed in the CI/CD pipeline.

---

## **9. Automated Checks**

The following tools are used to ensure compliance with coding conventions and are configured in the CI/CD pipeline:

- **ESLint**: Ensures adherence to style rules and best practices.
- **Prettier**: Automatically formats code to ensure consistency.

No manual action is required from developers: checks are executed automatically during commits and merge requests.

For more information on local setup of these tools, refer to the documentation dedicated to setting up the development environment.
