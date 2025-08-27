import { useEffect, useState } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  //common headers
const commonHeaders = {
  Authorization: token,
  'Content-Type': 'application/json'
};
//common fetch options pattern
const createFetchOptions = (method, payload = null) => ({
  method, 
  headers: commonHeaders,
  ...(payload && { body: JSON.stringify(payload) }),
});
//payload builder function
const createTodoPayload = (todo, includeId = false) => ({
  records: [
    {
      ...(includeId && { id: todo.id }),
      fields: {
        title: todo.title,
        isCompleted: todo.isCompleted,
      },
    },
  ],
});
//Todo transformer function 
const transformAirtableRecord = (record) => {
  const todo = {
    id: record.id,
    ...record.fields,
  };
  if (!todo.isCompleted) {
    todo.isCompleted = false;
  }
  return todo;
};
//error handling helper
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(()=> ({}));
    throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
  }
  return response;
};

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true); //shows loading message
      const options = createFetchOptions('GET'); //tells fetch this is a GET request with authentication
      try {
        const resp = await fetch(url, options); //makes api call and waits for response
        await handleApiError(resp);
        const response = await resp.json(); //convert response to jS object
        //transform each airtable record into a todo object
        const fetchedTodos = response.records.map(transformAirtableRecord);
        setTodoList(fetchedTodos); //update app state
      } catch (error) {
        setErrorMessage(error.message); // Display error to user
      } finally { //turns off loading message
        setIsLoading(false); 
      }
    };
    fetchTodos();
  }, [])

  const addTodo = async (newTodo) => {
   const payload = createTodoPayload(newTodo);
   const options = createFetchOptions('POST', payload);

   try {
    setIsSaving(true);
    const resp = await fetch(url, options);
    await handleApiError(resp);
    //process response and update state
    const { records } = await resp.json();
    
    const savedTodo = transformAirtableRecord(records[0]); 
    setTodoList([...todoList, savedTodo]);
   } catch (error) {
    console.log(error);
    setErrorMessage(error.message);
   } finally {
    setIsSaving(false); 
   }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodo = {...originalTodo, isCompleted: true};
    const payload = createTodoPayload(updatedTodo, true);
    const options = createFetchOptions('PATCH', payload);

    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      await handleApiError(resp);
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map(todo => {
        if (todo.id === id) {
          return originalTodo;
        } else {
          return todo;
        }
      });
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  const updateTodo = async (editedTodo) => {
    //save original todo
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    //create payload object
    const payload = createTodoPayload(editedTodo, true);
    //create options object
    const options = createFetchOptions('PATCH', payload);

    const updatedTodos = todoList.map(todo => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      await handleApiError(resp);
      //the optimisitc update stays
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      //create revertedTodos, restore original todo
      const revertedTodos = todoList.map(todo => {
        if (todo.id === editedTodo.id) {
          return originalTodo; //revert to original
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving}/>
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
