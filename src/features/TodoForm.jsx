import React from 'react';
import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

//define styled components 
const StyledForm = styled.form`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const StyledButton = styled.button`
  font-style: ${props => (props.disabled ? 'italic' : 'normal')};
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid black;
  background-color: #89dbe6;
  cursor: pointer;
  margin: 0.4rem;

  &:disabled {
    cursor: not-allowed;
    background-color: #eee;
    color: #aaa;
    border: 1px solid #ccc;
  }
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        labelText="Todo"
        elementId="todoTitle"
        value={workingTodoTitle}
        onChange={event => setWorkingTodoTitle(event.target.value)}
      />
      <StyledButton disabled={workingTodoTitle.trim() === ''}> 
        {isSaving ? 'Saving...' : 'Add todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
