//actions object defines the "types" of actions we can perfom
const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

//inital state before any actions occur. define before reducer so the reducer function uses it as a default value
let initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

//reducer takes a current 'state' and an 'action' object and returns the new state. it does not modify the original state directly
function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };
    case actions.loadTodos:
      const transformedTodos = action.records.map(record => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return { ...state, todoList: transformedTodos, isLoading: false };
    case actions.setLoadError:
      return { ...state, errorMessage: action.error.message, isLoading: false, isSaving: false, };
    case actions.startRequest:
      return { ...state, isSaving: true };
    case actions.addTodo:
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };
    case actions.revertTodo:
      
    case actions.updateTodo:
      const updatedTodos = state.todoList.map(todo => {
        if (todo.id === action.editedTodo.id) {
          return action.editedTodo;
        }
          return todo;
      });
      const updatedState = { ...state, todoList: updatedTodos };
      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }
      return updatedState;
    case actions.completeTodo:
      const updatedTodosList = state.todoList.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      return { ...state, todoList: updatedTodosList };

    case actions.clearError:
      return { ...state, errorMessage: '' };
    //if reducer recieves an action it does not recognize it will return the state as is with default
    default:
      return state;
  }
}

export { actions, initialState, reducer };
