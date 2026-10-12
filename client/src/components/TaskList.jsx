import TaskItem from "./TaskItem.jsx";

const EMPTY = {
  all: "No tasks yet. Add your first one above.",
  active: "All caught up.",
  completed: "No completed tasks yet.",
};

export default function TaskList({ tasks, filter, onUpdate, onDelete }) {
  if (tasks.length === 0) return <p className="empty">{EMPTY[filter]}</p>;

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
