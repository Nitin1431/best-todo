import { AddTodoForm } from "./todo-form";
import { deleteTodo, toggleTodo } from "./actions";
import { getTodos } from "@/lib/todos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();
  const completed = todos.filter((todo) => todo.completed).length;
  const remaining = todos.length - completed;

  return (
    <main className="page-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="card-header">
          <div>
            <p className="eyebrow">My Todo List</p>
            <h1 id="page-title">My Todo List</h1>
            <p className="subtitle">
              {todos.length === 0
                ? "A quiet list is a good place to start."
                : remaining === 0
                  ? "Everything is done. Nicely handled."
                  : `${remaining} ${remaining === 1 ? "task" : "tasks"} left for today`}
            </p>
          </div>
          <div className="progress-ring" aria-label={`${completed} of ${todos.length} completed`}>
            <span>{completed}</span>
            <small>done</small>
          </div>
        </header>

        <AddTodoForm />

        <div className="list-heading">
          <h2>Today</h2>
          <span>{todos.length} total</span>
        </div>

        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">✓</div>
            <h2>Your list is clear</h2>
            <p>Add a task above and make today count.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => {
              const toggle = toggleTodo.bind(null, todo.id);
              const remove = deleteTodo.bind(null, todo.id);

              return (
                <li className={todo.completed ? "todo-item completed" : "todo-item"} key={todo.id}>
                  <form action={toggle}>
                    <button
                      className="check-button"
                      type="submit"
                      aria-label={todo.completed ? `Mark ${todo.title} incomplete` : `Mark ${todo.title} complete`}
                    >
                      {todo.completed && <span aria-hidden="true">✓</span>}
                    </button>
                  </form>
                  <div className="todo-copy">
                    <span>{todo.title}</span>
                    <time dateTime={todo.createdAt}>
                      {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(todo.createdAt))}
                    </time>
                  </div>
                  <form action={remove}>
                    <button className="delete-button" type="submit" aria-label={`Delete ${todo.title}`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                      </svg>
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="card-footer">
          <span className="status-dot" aria-hidden="true" />
          Saved locally
        </footer>
      </section>
    </main>
  );
}
