Perfect. Now we’re designing this properly.

You want:

* ✅ GitHub integration steps
* ✅ Organization scoping model
* ✅ Clean schema so Cursor can generate it
* ✅ How frontend + backend + DB auth flow looks
* ✅ Using **Better Auth + Next.js + Tailwind + shadcn**

Let’s lock this architecture clearly.

---

# 🧠 High-Level Architecture

Stack:

* **Frontend + API:** Next.js (App Router)
* **UI:** Tailwind + shadcn/ui
* **Auth:** Better Auth
* **Hosting:** Cloudflare Pages
* **DB:** Cloudflare D1
* **GitHub Integration:** GitHub GitHub App
* **AI/Search (later):** Workers AI + Vectorize

Everything in one Next.js app for now.

---

# 🔐 PART 1 — AUTH ARCHITECTURE (Better Auth)

You will have 3 identity layers:

1. User (DocForge account)
2. Organization (internal grouping)
3. GitHub App installation (repo access)

---

## 🏗 Database Schema (Auth + Org + GitHub)

This is what you give to Cursor.

---

## users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  github_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## organizations

```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

## organization_members

```sql
CREATE TABLE organization_members (
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'admin', 'member')),
  PRIMARY KEY (org_id, user_id),
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## projects (GitHub repos)

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  github_repo_id TEXT NOT NULL,
  installation_id TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);
```

---

## pushes

```sql
CREATE TABLE pushes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

That’s your core access layer.

---

# 🧭 PART 2 — Auth Flow (Frontend + Backend)

Using Better Auth:

---

## 1️⃣ Login Flow

Frontend:

```tsx
<Button onClick={() => signIn("github")}>
  Login with GitHub
</Button>
```

Better Auth:

* Handles OAuth
* Returns user session
* You store github_id in users table

---

## 2️⃣ After Login

User lands on:

```text
/dashboard
```

If no org exists:

* Prompt: “Create Organization”

---

## 3️⃣ Create Organization Flow

Frontend:

* Modal: Org name
* POST `/api/org/create`

Backend:

* Insert into organizations
* Insert into organization_members as creator

---

# 🏢 Organization Scoping Logic

Every request must check:

1. Is user logged in?
2. Is user member of this org?
3. Is user role creator/admin for write operations?

Example middleware:

```ts
async function requireOrgRole(userId, orgId, roles: string[]) {
  const member = await db.query(`
    SELECT role FROM organization_members
    WHERE user_id = ? AND org_id = ?
  `, [userId, orgId])

  if (!member || !roles.includes(member.role)) {
    throw new Error("Unauthorized")
  }
}
```

---

# 🔗 PART 3 — GitHub Integration Steps (Exact)

You will use GitHub App.

---

## STEP 1 — Create GitHub App

In GitHub settings:

Permissions:

Repository:

* Contents: Read
* Metadata: Read
* Actions: Write (optional)
* Webhooks: Read

Events:

* Push
* Installation
* Installation repositories

Webhook URL:

```text
https://yourdomain.com/api/github/webhook
```

---

## STEP 2 — Add Project Button

Frontend:

```tsx
<Button asChild>
  <a href="https://github.com/apps/YOUR_APP_NAME/installations/new">
    Add GitHub Project
  </a>
</Button>
```

User installs app to repo.

---

## STEP 3 — Webhook Handles Installation

Endpoint:

```ts
app/api/github/webhook/route.ts
```

When installation happens:

You receive:

```json
{
  "installation": { "id": 123 },
  "repositories": [...]
}
```

You:

1. Identify current org
2. Insert project rows with:

   * github_repo_id
   * installation_id
   * org_id

Now project is linked.

---

# 🔑 How You Access Repo Later

Whenever you need repo access:

1. Generate JWT using GitHub App private key
2. Exchange for installation token
3. Use installation token to call:

```
GET /repos/{owner}/{repo}/contents
```

You never store permanent token.

---

# 🖥 Frontend Structure

```text
app/
  dashboard/
    layout.tsx
    page.tsx
    [org]/
      page.tsx
      projects/
        page.tsx
```

Sidebar:

* Org selector
* Projects
* Releases
* Search

---

# 🧠 Backend Structure

```text
app/api/
  auth/
  org/
  github/
  projects/
  search/
```

lib/

* db.ts
* github.ts
* auth.ts
* org.ts

Keep logic separated.

---

# 🔒 Access Model Summary

User
↓
Organization
↓
Organization Member Role
↓
Project (GitHub Repo)
↓
Installation ID
↓
Installation Token (generated on demand)

That’s your permission chain.

---

# 🎯 What Cursor Should Generate

Tell Cursor:

1. Create D1 schema above
2. Generate org CRUD APIs
3. Generate middleware for org role check
4. Generate GitHub webhook handler
5. Generate installation token helper

---

# 🚀 MVP Build Order

1. Better Auth login
2. Org creation
3. Org membership system
4. GitHub App setup
5. Webhook handler
6. Store project
7. Show project in dashboard

After that:
You have real repo access.

---

# 🏁 Final Architecture Snapshot

Frontend:
Next.js + Tailwind + shadcn

Auth:
Better Auth (GitHub OAuth)

Backend:
Next.js API routes (Edge)

DB:
D1

GitHub:
GitHub App

Org Model:
creator / admin / member

Everything clean.
Everything scoped.

---

If you want next, I can:

* Write GitHub JWT generation code
* Write webhook signature validation
* Design role-based middleware properly
* Or design project creation UI flow

Which one do you want to build first?

---

## Documentation Manager Index

For implementation traceability, use:
- `docs/documentation-manager/README.md`
- `docs/documentation-manager/commands/`
- `docs/documentation-manager/lessons-learned.md`
- `docs/documentation-manager/cases/admin/README.md`
- `docs/documentation-manager/cases/user/README.md`
- `docs/documentation-manager/cases/organization/README.md`

## Cursor Skill Pack Index

- `.cursor/skills/frontend-nextjs-shadcn/SKILL.md`
- `.cursor/skills/backend-nextjs-drizzle-auth/SKILL.md`
- `.cursor/skills/cloudflare-runtime-data/SKILL.md`
- `.cursor/skills/vercel-deployment-compat/SKILL.md`
- `.cursor/skills/design-quality-system/SKILL.md`
- `.cursor/skills/testing-quality-gates/SKILL.md`
- `.cursor/skills/security-authz-baseline/SKILL.md`
- `.cursor/skills/platform-roadmap-context/SKILL.md`
- `.cursor/rules/skill-loopback-governance.mdc`
