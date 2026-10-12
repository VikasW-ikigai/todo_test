import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3001;

// --- tiny JSON-file store (swap for a real database when you need one) ---
async function load() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}
const save = (tasks) => writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

const cleanTitle = (v) => (typeof v === "string" ? v.trim() : "");

// List tasks
app.get("/api/tasks", async (_req, res) => {
  res.json(await load());
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  const title = cleanTitle(req.body.title);
  if (!title) return res.status(400).json({ error: "Title is required." });
  if (title.length > 200) return res.status(400).json({ error: "Title must be 200 characters or fewer." });

  const tasks = await load();
  const task = { id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
  tasks.unshift(task);
  await save(tasks);
  res.status(201).json(task);
});

// Update a task (edit title and/or toggle completed)
app.patch("/api/tasks/:id", async (req, res) => {
  const tasks = await load();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });

  if ("title" in req.body) {
    const title = cleanTitle(req.body.title);
    if (!title) return res.status(400).json({ error: "Title is required." });
    if (title.length > 200) return res.status(400).json({ error: "Title must be 200 characters or fewer." });
    task.title = title;
  }
  if ("completed" in req.body) task.completed = Boolean(req.body.completed);

  await save(tasks);
  res.json(task);
});

// Delete all completed tasks
app.delete("/api/tasks", async (req, res) => {
  if (req.query.completed !== "true") return res.status(400).json({ error: "Use ?completed=true." });
  const tasks = await load();
  await save(tasks.filter((t) => !t.completed));
  res.status(204).end();
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  const tasks = await load();
  const next = tasks.filter((t) => t.id !== req.params.id);
  if (next.length === tasks.length) return res.status(404).json({ error: "Task not found." });
  await save(next);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
