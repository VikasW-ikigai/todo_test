import { useEffect, useRef, useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEdit = () => {
    setDraft(task.title);
    setEditing(true);
  };

  const save = () => {
    const value = draft.trim();
    setEditing(false);
    if (value && value !== task.title) onUpdate(task.id, { title: value });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <li className={task.completed ? "item done" : "item"}>
      <input
        type="checkbox"
        className="check"
        checked={task.completed}
        onChange={() => onUpdate(task.id, { completed: !task.completed })}
        aria-label={`Mark "${task.title}" as ${task.completed ? "not done" : "done"}`}
      />

      {editing ? (
        <input
          ref={inputRef}
          className="edit"
          value={draft}
          maxLength={200}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={onKeyDown}
          aria-label="Edit task"
        />
      ) : (
        <span className="title" onDoubleClick={startEdit}>{task.title}</span>
      )}

      <div className="actions">
        {!editing && <button onClick={startEdit}>Edit</button>}
        <button className="danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}
