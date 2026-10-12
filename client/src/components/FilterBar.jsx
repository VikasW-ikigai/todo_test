const FILTERS = [
  ["all", "All"],
  ["active", "Active"],
  ["completed", "Done"],
];

export default function FilterBar({ filter, onChange, counts, onClear }) {
  return (
    <div className="filters">
      <div role="tablist" aria-label="Filter tasks">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={filter === key ? "tab on" : "tab"}
            onClick={() => onChange(key)}
          >
            {label} <span className="count">{counts[key]}</span>
          </button>
        ))}
      </div>
      {counts.completed > 0 && (
        <button className="link" onClick={onClear}>Clear completed</button>
      )}
    </div>
  );
}
