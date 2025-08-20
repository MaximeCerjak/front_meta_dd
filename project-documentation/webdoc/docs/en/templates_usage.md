# Using Issue and Merge Request Templates

This guide explains how to use the issue and merge request templates available in the **project-documentation** repository to standardize and streamline task management and contributions.

---

## **1. Accessing Issue Templates**

Issue templates are centralized in this project under the `.gitlab/issue_templates/` directory. These templates help create clear and consistent tickets for various needs.

### **Available Templates**

- **Bug Report** (`bug.md`): To report an issue or unexpected behavior.
- **Feature Request** (`feature_request.md`): To propose a new feature.
- **Task Template** (`task.md`): To describe a task to be completed.
- **Documentation Template** (`documentation.md`): To request or structure documentation.
- **Hotfix Template** (`hotfix.md`): To fix an urgent issue.
- **Design/UX Feedback** (`design_feedback.md`): To provide feedback on a design or UX aspect.

---

### **2. Using an Issue Template in a Project**

1. **Step 1: Copy the Templates**

    - Navigate to the `.gitlab/issue_templates/` directory in this repository.
    - Download the template files you wish to use.
    - Add them to the target project under the directory:  
        `.gitlab/issue_templates/`.

2. **Step 2: Create an Issue with a Template**

    - Open the target project in GitLab.
    - Click **Issues > New Issue**.
    - In the **Use a template** dropdown menu, select the appropriate template.

---

## **3. Using a Merge Request Template**

Merge request templates are available in the `.gitlab/merge_request_templates/` directory.

### **Steps to Use a MR Template**

1. **Step 1: Copy the Template**
    - Copy the `merge_request.md` file to the target project under the directory:  
        `.gitlab/merge_request_templates/`.

2. **Step 2: Create a Merge Request**
    - Open the target project and click **Merge Requests > New Merge Request**.
    - Once the MR is prepared, GitLab will automatically suggest the template to use.

---

## **4. Adding or Updating Templates**

### **Step 1: Add a New Template**

1. Create a `.md` file for your new template in the appropriate directory:
    - For issues: `.gitlab/issue_templates/`
    - For MRs: `.gitlab/merge_request_templates/`
2. Follow the structure of existing templates to maintain consistency.

### **Step 2: Update an Existing Template**

1. Edit the corresponding `.md` file in this **project-documentation** repository.
2. Synchronize the updated templates in other projects (manually or via a CI/CD script).

---

## **5. Best Practices for Using Templates**

- **Choose the Right Template**: Select the template that matches the type of ticket or contribution (bug, feature, documentation, etc.).
- **Be Precise**: Fill out all sections of the template to provide clear and complete information.
- **Follow Standards**: Adhere to the template instructions to avoid unnecessary back-and-forth during reviews.
- **Regularly Update Templates**: Ensure templates remain aligned with the project’s needs.

---

## **6. Resources and References**

- GitLab Documentation: [Customizing Issue Templates](https://docs.gitlab.com/ee/user/project/description_templates.html)
- Template Directories: `.gitlab/issue_templates/` and `.gitlab/merge_request_templates/`

---

## **Usage Example**

### **Creating a Bug Issue**

1. Go to **Issues > New Issue** in your project.
2. Select the **Bug Report** template from the dropdown menu.
3. Fill out the sections:
    - **Problem Description**
    - **Steps to Reproduce**
    - **Logs/Errors**
4. Submit the issue.
