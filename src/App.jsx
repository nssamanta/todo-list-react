import { useEffect, useState, useCallback, useReducer } from 'react';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import styles from './App.module.css';
import styled, { createGlobalStyle } from 'styled-components';
import logo from './assets/checkmark.svg';
import {
  reducer as todoReducer,
  actions as todoActions,
  initialState as initialTodoState,
} from './reducers/todos.reducer';

const GlobalStyle = createGlobalStyle`
  body {
  background-image: url('https://images.unsplash.com/photo-1740532501882-5766c265f637?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin: 0;
  }
`;

const StyledLogo = styled.img`
  width: 50px;
  height: 50px;
`;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function App() {
  const [todoState, dispatch] = useReducer(todoReducer, initialTodoState);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortDirection, sortField, queryString]);

  //common headers
  const commonHeaders = {
    Authorization: token,
    'Content-Type': 'application/json',
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
  const transformAirtableRecord = record => {
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
  const handleApiError = async response => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Request failed with status ${response.status}`
      );
    }
    return response;
  };

  useEffect(() => {
    console.log('🌐 API call triggered! queryString:', queryString);
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      const options = createFetchOptions('GET'); //tells fetch this is a GET request with authentication
      try {
        const resp = await fetch(encodeUrl(), options); //makes api call and waits for response
        await handleApiError(resp);
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error });
      }
    };
    fetchTodos();
  }, [sortDirection, sortField, queryString, dispatch]);

  const addTodo = async newTodo => {
    const payload = createTodoPayload(newTodo);
    const options = createFetchOptions('POST', payload);

    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      await handleApiError(resp);
      //process response and update state
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      console.log(error);
      dispatch({ type: todoActions.setLoadError, error: error });
    }
  };

  const completeTodo = async id => {
    const originalTodo = todoState.todoList.find(todo => todo.id === id);
    dispatch({ type: todoActions.completeTodo, id: id });
    const updatedTodo = { ...originalTodo, isCompleted: true };
    const payload = createTodoPayload(updatedTodo, true);
    const options = createFetchOptions('PATCH', payload);
    try {
      const resp = await fetch(encodeUrl(), options);
      await handleApiError(resp);
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: error,
      });
    }
  };

  const updateTodo = async editedTodo => {
    //save original todo
    const originalTodo = todoState.todoList.find(
      todo => todo.id === editedTodo.id
    );
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
    //create payload/options object
    const payload = createTodoPayload(editedTodo, true);
    const options = createFetchOptions('PATCH', payload);
    try {
      const resp = await fetch(encodeUrl(), options);
      await handleApiError(resp);
      //the optimisitc update stays
    } catch (error) {
      //create revertedTodos, restore original todo
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error: error,
      });
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className={styles.appContainer}>
        <StyledHeader>
          <StyledLogo src={logo} alt="Todo List Logo" />
          <h1>My Todos</h1>
        </StyledHeader>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
        <hr />
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />

        {todoState.errorMessage && (
          <div className={styles.errorMessage}>
            <hr />
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
