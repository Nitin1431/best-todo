import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type Todo = { id: string; title: string; completed: boolean; createdAt: string };

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "todos.json");
const temporaryFile = path.join(dataDirectory, "todos.tmp.json");

async function readTodos(): Promise<Todo[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(dataFile, "utf8"));
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeTodos(todos: Todo[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(temporaryFile, `${JSON.stringify(todos, null, 2)}\n`, "utf8");
  await rename(temporaryFile, dataFile);
}

export async function getTodos() { return readTodos(); }

export async function addTodo(title: string) {
  const todos = await readTodos();
  todos.unshift({ id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() });
  await writeTodos(todos);
}

export async function toggleTodoById(id: string) {
  const todos = await readTodos();
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  await writeTodos(todos);
}

export async function deleteTodoById(id: string) {
  const todos = await readTodos();
  await writeTodos(todos.filter((todo) => todo.id !== id));
}
