import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}){  
    return (
      <div>
        {todoList.length === 0 ? (
          <p>Add todo above to get started</p>
        ) : (
        <ul>
          {todoList.map(todo => (
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo}/>
          ))}
        </ul>
        )}
      </div>
    );
}
export default TodoList;