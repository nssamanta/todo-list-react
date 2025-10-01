import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const navigate = useNavigate();

  //calculations, get page from url, default to 1 and convert to a number
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  //calculate the todos to show on the current page
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = currentPage * itemsPerPage;
  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfLastTodo
  );

  //calculate total number of pages needed
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  //handlers for buttons
  const handlePreviousPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    setSearchParams({ page: prevPage });
  };

  const handleNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setSearchParams({ page: nextPage });
  };

  //useEffect to handle invalid page numbers in url
  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <>
          <ul className={styles.todoList}>
            {currentTodos.map(todo => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
          </ul>

          <div className="paginationControls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default TodoList;
