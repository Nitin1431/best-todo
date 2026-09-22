"use client";

import { useActionState, useEffect, useRef } from "react";
import { addTodo, type AddTodoState } from "./actions";

const initialState: AddTodoState = { error: null, success: false };

export function AddTodoForm() {
  const [state, formAction, pending] = useActionState(addTodo, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="add-form">
      <div className="input-wrap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        <input name="title" type="text" placeholder="What needs to be done?" maxLength={120} autoComplete="off" aria-label="New task" aria-describedby={state.error ? "form-error" : undefined} />
      </div>
      <button type="submit" disabled={pending}>{pending ? "Adding…" : "Add task"}</button>
      {state.error && <p className="form-error" id="form-error">{state.error}</p>}
    </form>
  );
}
