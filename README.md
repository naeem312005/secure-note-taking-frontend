# Secure Note-Taking Application — Frontend

A clean, responsive, and functional React + Vite single-page application built for the CareGuide Technical Interview Assignment.

---

## Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with centralized request & response interceptors
- **Routing**: React Router DOM (v7) with nested Protected and Admin routes
- **State Management**: React Context API (`AuthContext`)

---

## Key Features & Page Inventory

1. **Authentication**:
   - `LoginPage` (`/login`): Form validation, token storage, error handling, session expiry banner.
   - `RegisterPage` (`/register`): User registration with interests tags (cannot escalate to admin).
2. **User Notes**:
   - `UserDashboardPage` (`/dashboard`): Overview cards, recent notes, quick actions.
   - `NotesListPage` (`/notes`): Full paginated list of private notes (supported by MongoDB compound index).
   - `CreateNotePage` (`/notes/create`): Create new encrypted note.
   - `EditNotePage` (`/notes/edit/:id`): Edit note (ownership strictly verified).
3. **Public Community Posts**:
   - `PublicPostsPage` (`/posts`): Public feed of developer posts, paginated, with create/edit/delete actions for authors.
4. **Administrative Modules (Role-Protected)**:
   - `AdminDashboardPage` (`/admin`): Metrics (Total Users, Total Notes, Total Posts) and quick navigation.
   - `UserManagementPage` (`/admin/users`): Complete user management with pagination, role switching, edit modal, creation modal, and safeguards (self-deletion & last-admin protection).
   - `AllNotesPage` (`/admin/notes`): System-wide note viewer across all users.
   - `InterestsAggregationPage` (`/admin/aggregations/interests`): Visual display of users grouped by shared interests via MongoDB Scenario 1 single-pipeline aggregation.
   - `UserPostsLookupPage` (`/admin/users/:id/posts`): Visual display of posts joined via MongoDB Scenario 2 `$lookup` pipeline.
5. **Route Safeguards**:
   - `ProtectedRoute`: Rejects unauthenticated visits.
   - `AdminRoute`: Rejects non-admin authenticated visits, redirecting to `/dashboard`.
   - `NotFoundPage` (`*`): Custom 404 page.

---

## Local Development Setup

1. Navigate to the frontend directory:
   ```bash
   cd secure-note-taking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## Deployment on Vercel

This repository includes `vercel.json` configured with SPA routing rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy:
1. Import `secure-note-taking-frontend` repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api`
6. Click **Deploy**.
