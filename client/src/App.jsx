import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import FilterBar from "./components/FilterBar.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.list().then(setTasks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  // Wrap actions so any failure surfaces in one place.
  const run = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    }
  };

  const addTask = (title) =>
    run(async () => {
      const task = await api.create(title);
      setTasks((t) => [task, ...t]);
    });

  const updateTask = (id, changes) =>
    run(async () => {
      const task = await api.update(id, changes);
      setTasks((t) => t.map((x) => (x.id === id ? task : x)));
    });

  const deleteTask = (id) =>
    run(async () => {
      await api.remove(id);
      setTasks((t) => t.filter((x) => x.id !== id));
    });

  const clearCompleted = () =>
    run(async () => {
      await api.clearCompleted();
      setTasks((t) => t.filter((x) => !x.completed));
    });

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.completed).length;
    return { all: tasks.length, active: tasks.length - done, completed: done };
  }, [tasks]);

  const visible = tasks.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );

  return (
    <main className="shell">
      <header className="masthead">
        <h1>Tasks</h1>
        <p className="remaining">
          {counts.active === 0 ? "Nothing left to do" : `${counts.active} left to do`}
        </p>
      </header>

      <TaskForm onAdd={addTask} />

      {error && (
        <div className="banner" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="Dismiss error">Dismiss</button>
        </div>
      )}

      <FilterBar filter={filter} onChange={setFilter} counts={counts} onClear={clearCompleted} />

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : (
        <TaskList tasks={visible} filter={filter} onUpdate={updateTask} onDelete={deleteTask} />
      )}
    </main>
  );
}
