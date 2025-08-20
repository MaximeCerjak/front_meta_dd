# Git Conventions

## **1. Objective**

This document aims to define clear conventions for using Git in projects to ensure:

- Consistent branch management.
- A clear and useful history.
- Effective collaboration among team members.

---

## **2. Branch Organization**

### **2.1 Main Branches**

- **`main`**:
  - Contains stable, production-ready code.
  - No direct development should be done on `main`.
  - Only versions validated by the CI/CD pipeline should be merged.
- **`develop`**:
  - Contains the latest development code, intended for testing before merging into `main`.
  - Used as the base for creating feature branches.

---

### **2.2 Temporary Branches**

- **Feature branches**:
  - Used to develop new features.
  - Naming: `feature/<description>` (e.g., `feature/add-login`).
  - Based on the `develop` branch.
  - Deleted after merging into `develop`.
- **Hotfix branches**:
  - Used to fix critical bugs in production.
  - Naming: `hotfix/<description>` (e.g., `hotfix/fix-crash`).
  - Based on the `main` branch.
  - Merged into both `main` and `develop`.
- **Release branches**:
  - Used to prepare a stable version before production deployment.
  - Naming: `release/<version>` (e.g., `release/v1.2.0`).
  - Based on `develop`.
  - Merged into both `main` and `develop` after validation.

---

## **3. Git Workflow**

### **3.1 Commit Rules**

- Write clear and concise commit messages in English:
  - Line 1: Summary, up to 50 characters.
  - Line 2: A blank line.
  - Line 3: Additional details, if necessary.

Example:

```css
Fix user login issue  

Resolved a bug where users were unable to login due to incorrect password hashing.

```

- Group commits into logical units (avoid repeated "Fix typo").
- Prefer multiple small commits over one large commit.

---

### **3.2 Merge Process**

- Merges into `main` or `develop` must be done via a **Merge Request (MR)**.
- All MRs must:
  - Be reviewed by at least one other developer.
  - Pass automated tests in the CI/CD pipeline.

### **3.3 Conflict Resolution**

- Resolve conflicts locally before submitting an MR.
- Test the code after each resolution to ensure stability.

---

## **4. Semantic Versioning**

Adopt semantic versioning for releases in the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Incremented for major or breaking changes.
- **MINOR**: Incremented for added features while maintaining backward compatibility.
- **PATCH**: Incremented for bug fixes with no new features.

Example:

```yaml
v1.0.0: First stable release.
v1.1.0: Added a new feature (backward compatible). 
v1.1.1: Bug fixes.
```

---

## **5. Repository Organization**

### **5.1 Multi-Repo vs Monorepo**

- **Multi-Repo**: Each component or microservice is isolated in its own repository. Ideal for modular architectures.
- **Monorepo**: All services and components are grouped in a single repository. Simplifies management of internal dependencies.

### **5.2 Repository Structure**

For each repository, follow this minimal organization:

```bash
<repository-root>/ 
├── src/                # Source code 
│   ├── controllers/    # Controllers 
│   ├── models/         # Data models 
│   ├── routes/         # Route definitions 
│   └── utils/          # Utility functions 
├── tests/              # Unit and integration tests 
├── .gitignore          # Git ignore list 
├── README.md           # Project documentation 
└── package.json        # Dependencies (for Node.js projects)
```

## **6. Checklist for Merge Requests**

Before submitting an MR:

- [ ]  Code is functional and tested locally.
- [ ]  Code follows defined style conventions.
- [ ]  All commits are well-written and logically grouped.
- [ ]  Automated tests pass successfully.

---

## **7. Automation and CI/CD**

- Use tools like **GitLab CI/CD** to:
  - Automatically run unit tests on every push.
  - Validate code against conventions.
  - Generate build artifacts for releases.
- Configure distinct pipelines for `develop`, `release/*`, and `main` branches:
  - **develop**: Test and validate new features.
  - **release/**: Prepare the version for production.
  - **main**: Automatically deploy validated builds.

---

## **8. Recommended Tools**

- **Git Hooks**: Configure hooks to enforce commit conventions and run tests before each push.
- **Pre-commit Linter**: Integrate a tool like **commitlint** to validate commit messages.
- **Git GUI**: Use interfaces like SourceTree or GitKraken to simplify branch and conflict management.
