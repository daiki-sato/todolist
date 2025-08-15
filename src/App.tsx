import { useState } from "react";
import "./App.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const points = tasks.filter((task) => task.completed).length * 10;

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <p>ポイント: {points}</p>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="タスクを追加"
        />
        <button type="submit">追加</button>
      </form>
      <ul>
        {tasks.map((task) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
