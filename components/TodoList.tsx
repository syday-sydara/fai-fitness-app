"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Todo = { id: string; text: string; done: boolean };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data.data || []));
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTodo }),
    });
    const data = await res.json();
    if (data.success) {
      setTodos([...todos, data.data]);
      setNewTodo("");
      toast.success("Todo added!");
    }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done }),
    });
    const data = await res.json();
    if (data.success) {
      setTodos(todos.map((t) => (t.id === id ? { ...t, done } : t)));
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setTodos(todos.filter((t) => t.id !== id));
      toast.success("Todo deleted");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Todo List
      </h2>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-grow rounded"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo..."
        />
        <button
          onClick={addTodo}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
            >
              <span
                className={`cursor-pointer ${
                  todo.done ? "line-through text-gray-500" : ""
                }`}
                onClick={() => toggleTodo(todo.id, !todo.done)}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}