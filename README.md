# Tasks — a React + Express to-do app

## Structure
```
todo-app/
├── client/   React (Vite) frontend
│   └── src/  App.jsx, api.js, components/{TaskForm,TaskList,TaskItem,FilterBar}.jsx
└── server/   Express REST API (tasks persisted to server/data.json)
```

## Run it
```bash
npm run install:all   # installs root, server and client dependencies
npm run dev           # API on :3001, web app on :5173
```
Open http://localhost:5173.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task `{ title }` |
| PATCH | `/api/tasks/:id` | Edit title and/or toggle `{ title?, completed? }` |
| DELETE | `/api/tasks/:id` | Delete one task |
| DELETE | `/api/tasks?completed=true` | Clear all completed tasks |

## Using the app
- **Add:** type in the box and press Enter.
- **Edit:** click *Edit* or double-click a task. Enter saves, Escape cancels.
- **Complete:** click the circle.
- **Delete:** click *Delete*. Use *Clear completed* to remove all finished tasks.

## Next steps
Swap the JSON file in `server/index.js` for SQLite or Postgres; add due dates or drag-to-reorder.
