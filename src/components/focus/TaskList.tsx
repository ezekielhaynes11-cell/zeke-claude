"use client";

import { useState } from "react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), text, done: false },
    ]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="bg-[#1e1e2e] rounded-2xl p-6 border border-[#313244]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#cdd6f4]">Focus Tasks</h3>
        {tasks.length > 0 && (
          <span className="text-xs text-[#a6adc8] bg-[#313244] px-2 py-1 rounded-full">
            {completedCount}/{tasks.length}
          </span>
        )}
      </div>

      {/* Add task input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="What are you working on?"
          className="flex-1 bg-[#313244] text-[#cdd6f4] placeholder-[#585b70] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#cba6f7]/40 transition-all"
        />
        <button
          onClick={addTask}
          className="bg-[#cba6f7] text-[#1e1e2e] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#b4befe] transition-colors"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-[#585b70] text-center py-4">
            Add tasks to stay focused
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-[#313244]/50 transition-colors"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done
                    ? "bg-[#a6e3a1] border-[#a6e3a1]"
                    : "border-[#585b70] hover:border-[#cba6f7]"
                }`}
              >
                {task.done && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1e1e2e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm transition-all ${
                  task.done
                    ? "text-[#585b70] line-through"
                    : "text-[#cdd6f4]"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-[#585b70] hover:text-[#f38ba8] transition-all"
                aria-label="Remove task"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mt-4">
          <div className="w-full h-1.5 bg-[#313244] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#a6e3a1] rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / tasks.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
