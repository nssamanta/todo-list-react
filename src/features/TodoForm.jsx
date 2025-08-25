import React from "react";
import {useRef, useState} from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({onAddTodo}){
    const todoTitleInput = useRef('');
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    function handleAddTodo(event) {
        event.preventDefault(); //prevents the page from refreshing when a user clicks the Add Todo button
        onAddTodo(workingTodoTitle); //call the function with workingTodoTitle
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
        <button disabled={workingTodoTitle === ''}>Add Todo</button>
      </form>
    );
}

export default TodoForm;