import { useEffect, useState } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true); //shows loading message
      const options = {method: "GET", headers: {"Authorization": token}}; //tells fetch is is a GET request with authentication
      try {
        const resp = await fetch(url, options); //makes api call and waits for response
        if (!resp.ok) {
          //checks if API returned an error
          throw new Error(resp.message);
        }
        const response = await resp.json(); //convert response to jS object
        const records = response.records; //extract records array
        //transform each airtable record into a todo object
        const fetchedTodos = records.map(record => {
          const todo = {
            id: record.id, //get id from top level
            ...record.fields, //spread all fields to top level
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(fetchedTodos); //update app state
      } catch (error) {
        setErrorMessage(error.message); // Display error to user
      } finally { //turns off loading message
        setIsLoading(false); 
      }
    };
    fetchTodos();
  }, [])

  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={isLoading}/>
      {errorMessage && (
        <div>
          <hr/>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
