# Secrets Management

## **1. Objective**

This document provides best practices and tools for managing secrets in your projects, such as API keys, passwords, certificates, and other sensitive information. Secure secrets management is essential to protect data and services from unauthorized access.

---

## **2. Best Practices**

### **2.1 Never Include Secrets in Source Code**

- Use dedicated files, such as `.env`, to store secrets locally.
- Add these files to `.gitignore` to prevent them from being versioned.

### **2.2 Encrypt Sensitive Secrets**

- Use tools like **gpg** or **sops** to encrypt secrets before storing or sharing them.
- Store encrypted secrets in the repository only if absolutely necessary.

### **2.3 Centralize Secrets with Secret Managers**

- Use proven solutions to centralize and manage secrets:
  - **AWS Secrets Manager**
  - **HashiCorp Vault**
  - **Azure Key Vault**

### **2.4 Regularly Rotate Secrets**

- Regularly change critical API keys, certificates, and passwords.
- Set up alerts for secrets nearing expiration.

### **2.5 Restrict Permissions**

- Limit access to secrets to the minimum necessary:
  - Use roles and policies in secret managers.
  - Configure specific permissions per environment (dev, staging, prod).

---

## **3. Managing Secrets in Environments**

### **3.1 Environment Variables**

Use environment variables to inject secrets into applications. Example of a `.env` file:

```yaml
DB_PASSWORD=supersecretdatabasepassword 
API_KEY=abc123xyz
```

Access in code:

```javascript
const apiKey = process.env.API_KEY;
```

### **3.2 CI/CD Management**

1. Go to **GitLab > Settings > CI/CD > Variables**.
2. Add secrets as protected variables in the CI/CD configuration.
3. Use these variables in your pipeline scripts.

Example of a `.gitlab-ci.yml` pipeline:

```yaml
stages:
  - deploy
deploy:
  script:
    - echo "Deploying with API Key: $API_KEY"
```

---

## **4. Security Best Practices**

### **4.1 Detecting Secrets in Code**

- Use tools like **GitLeaks** or **TruffleHog** to scan the repository for secrets accidentally committed.

### **4.2 Secure Secret Storage**

- If a secret is accidentally published, consider it compromised.
- Immediately revoke the compromised secret and replace it.

### **4.3 Environment Isolation**

- Each environment (development, staging, production) should have separate secrets.
- Do not share secrets between environments.

---

## **5. Recommended Tools**

1. **Secret Managers**:
   - **AWS Secrets Manager**
   - **HashiCorp Vault**
   - **Azure Key Vault**

2. **Secrets Analysis**:
   - **GitLeaks**: Detects secrets in Git repositories.
   - **TruffleHog**: Scans repositories for API keys or other sensitive data.

3. **Secrets Encryption**:
    - **gpg**: Encrypts and decrypts files securely.
    - **sops**: Encrypts secrets in YAML, JSON, or other formats.
    - **OpenSSL**: Command-line tool for encryption and decryption.

---

## **6. Checklist for Secure Secrets Management**

- [ ] Never include secrets in source code.
- [ ] Regularly rotate critical secrets.
- [ ] Use secure secret managers for centralized storage.
- [ ] Encrypt sensitive secrets before storing or sharing.
- [ ] Limit access to secrets based on roles and environments.
- [ ] Detect and revoke exposed secrets immediately.
- [ ] Use environment variables to inject secrets into applications.
- [ ] Secure secrets in CI/CD pipelines with protected variables.
