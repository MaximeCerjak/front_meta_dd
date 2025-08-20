# Access and Permissions Management

## **1. Objective**

This document outlines best practices for managing access and permissions to systems, services, and sensitive data. Effective permission management is crucial to protect resources from unauthorized access.

---

## **2. Best Practices**

### **2.1 Apply the Principle of Least Privilege**

- Ensure that each user or service has only the permissions necessary to perform their tasks.
- Avoid granting administrative roles unless strictly necessary.

### **2.2 Strengthened Authentication**

- Enable two-factor authentication (2FA) for all critical accounts, especially those with access to production environments.
- Prefer Single Sign-On (SSO) solutions to centralize and secure access.

### **2.3 Periodic Audits**

- Review user permissions every three months.
- Revoke access for team members who have left or changed roles.

### **2.4 Access Logging**

- Enable logging for all access to critical systems.
- Regularly analyze logs to detect suspicious activities.

---

## **3. Access Management in GitLab**

### **3.1 Roles and Permissions**

- **Guest**: Limited access, mainly read-only for public repositories.
- **Reporter**: Can access issues and pipelines but cannot push code.
- **Developer**: Can push code and work on feature branches.
- **Maintainer**: Can merge into `main` and configure CI/CD pipelines.
- **Owner**: Full project and permissions management.

### **3.2 Recommended Configurations**

- Assign the **Maintainer** role only to technical leads or project managers.
- Limit **Developers'** permissions to the branches they are working on.

---

## **4. Access Control for Environments**

### **4.1 Access by Environment**

- **Development**:
  - Broad access for developers, but no sensitive data should be present.
- **Staging**:
  - Restricted access for developers, with authorization for final testing.
- **Production**:
  - Access limited to Maintainers and Administrators only.

### **4.2 Permissions on Secrets**

- Configure secrets based on roles and environments.
- Examples in GitLab CI/CD:
  - **Protected Variables**: Variables accessible only from protected branches (`main`, `release/*`).
  - **Environment Variables**:
    - Production: Accessible only by specific runners.

---

## **5. Best Practices for External Systems**

1. **API Key Management**:
   - Assign specific permissions to each API key (e.g., read-only, write).
   - Revoke compromised keys immediately.

2. **Database Access Control**:
   - Create specific accounts with minimal permissions (e.g., read-only for reports).
   - Never share administrator accounts.

3. **Application Permission Management**:
   - Use IAM roles to manage permissions in cloud systems like AWS, Azure, or GCP.
   - Assign specific roles to each application or service.

---

## **6. Recommended Tools**

1. **IAM (Identity and Access Management)**:
   - AWS IAM, Azure AD, or Google IAM to manage access to cloud services.
   - Keycloak for open-source identity management solutions.

2. **Audit and Monitoring**:
   - **Datadog**: Monitor access and detect suspicious behavior.
   - **Splunk**: Deep log analysis.

3. **Git Access Management**:
   - **GitLab Permissions**: Configure roles and permissions directly in GitLab.
   - **Git Hooks**: Implement custom restrictions on repositories.

---

## **7. Checklist for Secure Access Management**

- [ ] Roles and permissions are configured according to the principle of least privilege.
- [ ] Unused accounts are regularly disabled or deleted.
- [ ] Two-factor authentication is enabled for all critical accounts.
- [ ] Access to internal and external systems is logged.
- [ ] Access is audited every three months.
