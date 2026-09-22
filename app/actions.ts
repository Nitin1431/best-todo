"use server";

import { revalidatePath } from "next/cache";
import { addTodo as addTodoToFile, deleteTodoById, toggleTodoById } from "@/lib/todos";

export type AddTodoState = { error: string | null; success: boolean };

export async function addTodo(
  _previousState: AddTodoState,
  formData: FormData,
): Promise<AddTodoState> {
  const title = formData.get("title");
  if (typeof title !== "string" || title.trim().length === 0) {
    return { error: "Enter a task before adding it.", success: false };
  }
  if (title.trim().length > 120) {
    return { error: "Keep your task under 120 characters.", success: false };
  }
  await addTodoToFile(title.trim());
  revalidatePath("/");
  return { error: null, success: true };
}

export async function toggleTodo(id: string) {
  if (typeof id !== "string" || id.length > 100) return;
  await toggleTodoById(id);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  if (typeof id !== "string" || id.length > 100) return;
  await deleteTodoById(id);
  revalidatePath("/");
}
