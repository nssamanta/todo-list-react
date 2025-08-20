import { useState } from "react";
import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";

function App() {
  const [todoList, setTodoList] = useState([]);

function addTodo(title) {
  const newTodo = {title, id:Date.now(), isCompleted: false};
  setTodoList([...todoList, newTodo]);
}

function completeTodo(id) {
  const updatedTodos = todoList.map(todo => {
    if (todo.id === id) {
      return {...todo, isCompleted: true};
    } else {
      return todo;
    }
});
  setTodoList(updatedTodos);
}

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  );
}

export default App;
