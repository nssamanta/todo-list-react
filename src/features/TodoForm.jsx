import React from 'react';
import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault(); //prevents the page from refreshing when a user clicks the Add Todo button
    onAddTodo({
        title: workingTodoTitle,
        isCompleted: false,
    }); //pass object with title and isComplete properties
    setWorkingTodoTitle(''); //reset the form input
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        labelText="Todo"
        elementId="todoTitle"
        value={workingTodoTitle}
        onChange={event => setWorkingTodoTitle(event.target.value)}
      />
      <button disabled={workingTodoTitle.trim() === ''}> 
        {isSaving ? 'Saving...' : 'Add todo'}
      </button>
    </form>
  );
}

export default TodoForm;
