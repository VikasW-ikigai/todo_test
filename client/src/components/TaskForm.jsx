import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    setTitle("");
    await onAdd(value);
  };

  return (
    <form className="add" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        aria-label="New task"
      />
      <button type="submit" disabled={!title.trim()}>Add task</button>
    </form>
  );
}
