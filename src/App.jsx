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

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true); //shows loading message
      const options = {method: "GET", headers: {"Authorization": token}}; //tells fetch this is a GET request with authentication
      try {
        const resp = await fetch(url, options); //makes api call and waits for response
        if (!resp.ok) {
          //checks if API returned an error
          throw new Error(resp.message);
        }
        const response = await resp.json(); //convert response to jS object
        const records = response.records; //extract records array
        //transform each airtable record into a todo object
        const fetchedTodos = records.map((record) => {
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

  const addTodo = async (newTodo) => {
   const payload = {
    records: [
      {
        fields: {
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        },
      },
    ],
   };
   const options = {
    method: 'POST',
    headers: {
      Authorization: token, 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
   };

   try {
    setIsSaving(true);
    const resp = await fetch(url, options);
    if(!resp.ok) {
      throw new Error(resp.message);
    }
    //process response and update state
    const { records } = await resp.json();
    const savedTodo = {
      id: records[0].id,
      ...records[0].fields,
    }
    if (!records[0].fields.isCompleted) {
      savedTodo.isCompleted = false;
    }
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
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

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
      if (!resp.ok) {
        throw new Error(resp.message);
      }
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
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    //create options object
    const options = {
      method: 'PATCH', //use PATCH method
      headers: {
        Authorization: token, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload), 
    };

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
      if (!resp.ok) {
        throw new Error(resp.message);
      }
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
