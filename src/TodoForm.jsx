import React from "react";
import {useRef} from "react";
function TodoForm({onAddTodo}){
    const todoTitleInput = useRef('');

    function handleAddTodo(event) {
        event.preventDefault(); //prevents the page from refreshing when a user clicks the Add Todo button
        const title = event.target.title.value;
        onAddTodo(title); //call the function with title
        event.target.title.value = ''; //clear the input
        todoTitleInput.current.focus();
    }
    
    return(
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Todo</label>
            <input ref={todoTitleInput} name="title" id='todoTitle'></input>
            <button>Add Todo</button>
        </form>
    );
}

export default TodoForm;