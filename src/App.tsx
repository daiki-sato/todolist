import { useState, useEffect } from "react";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored) as Task[]);
      } catch {
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newTask: Task = { id: Date.now(), text, completed: false };
    setTasks((prev) => [...prev, newTask]);
    setText("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const points = completedCount * 10;

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <p>ポイント: {points}</p>
      <p>
        完了: {completedCount} / {tasks.length}
      </p>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="タスクを追加"
        />
        <button type="submit">追加</button>
      </form>
      <div className="filters">
        <button
          type="button"
          onClick={() => setFilter("all")}
          disabled={filter === "all"}
        >
          すべて
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          disabled={filter === "active"}
        >
          未完了
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          disabled={filter === "completed"}
        >
          完了済み
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.text}
              </span>
            </label>
            <button type="button" onClick={() => removeTask(task.id)}>削除</button>
          </li>
        ))}
      </ul>
      {completedCount > 0 && (
        <button type="button" onClick={clearCompleted}>
          完了を一括削除
        </button>
      )}
    </div>
  );
}

export default App;

