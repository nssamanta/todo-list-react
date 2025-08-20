import React from "react";
import {useRef, useState} from "react";

function TodoForm({onAddTodo}){
    const todoTitleInput = useRef('');
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    function handleAddTodo(event) {
        event.preventDefault(); //prevents the page from refreshing when a user clicks the Add Todo button
        onAddTodo(workingTodoTitle); //call the function with workingTodoTitle
        setWorkingTodoTitle(''); //reset the form input
        todoTitleInput.current.focus();
    }
    
    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Todo</label>
            <input 
            ref={todoTitleInput} 
            name="title" 
            id='todoTitle'
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            ></input>
            <button disabled={workingTodoTitle === ''}>Add Todo</button>
        </form>
    );
}

export default TodoForm;