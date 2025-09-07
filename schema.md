# User Schema Documentation

## **User Model**
Represents a registered user in the system.

| Field       | Type        | Required | Unique | Default | Description |
|-------------|------------|----------|--------|---------|-------------|
| **name**    | String     | ✅       | ❌      | -       | Full name of the user. |
| **email**   | String     | ✅       | ✅      | lowercase | User’s email (used for login, must be unique). |
| **education** | String   | ❌       | ❌      | -       | Education details of the user. |
| **skills**  | [String]   | ❌       | ❌      | []      | List of skills (e.g., `"React"`, `"Node.js"`). |
| **projects** | [Project] | ❌       | ❌      | []      | List of projects created by the user. |
| **work**    | [String]   | ❌       | ❌      | []      | Work experiences or roles. |
| **links**   | [String]   | ❌       | ❌      | []      | External links (e.g., portfolio, GitHub, LinkedIn). |
| **password** | String    | ✅       | ❌      | -       | Hashed password (excluded by default in queries). |
| **role**    | String     | ✅       | ❌      | `"user"` | User role, must be `"admin"` or `"user"`. |

### Options
- **Timestamps**: `createdAt`, `updatedAt`.

---

## **Project (Subdocument)**
Embedded inside the user’s `projects` array.

| Field   | Type   | Required | Description |
|---------|-------|----------|-------------|
| **title** | String | ✅ | Title of the project. |
| **desc**  | String | ❌ | Short description of the project. |
| **links** | String | ❌ | URL link related to the project (e.g., GitHub repo, live demo). |

---

## 🔐 Security
- Passwords are stored with **bcrypt hashing**.
- `password` field has `select: false` → excluded by default from queries.
- Always hash password before saving a new user.

---

## Example User Document
```json
{
  "name": "Devesh Pandey",
  "email": "devesh@example.com",
  "education": "B.Tech CSE",
  "skills": ["React", "Node.js", "MongoDB"],
  "projects": [
    {
      "title": "Portfolio Website",
      "desc": "Personal portfolio built with React",
      "links": "https://deveshpandey65.vercel.app"
    }
  ],
  "work": ["Frontend Developer Intern at xyz"],
  "links": ["https://linkedin.com/in/deveshpandey65", "https://github.com/deveshpandey65"],
  "role": "user"
}
