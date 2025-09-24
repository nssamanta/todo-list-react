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
      return { ...state };
    case actions.loadTodos:
      return { ...state };
    case actions.setLoadError:
      return { ...state };
    case actions.startRequest:
      return { ...state };
    case actions.addTodo:
      return { ...state };
    case actions.endRequest:
      return { ...state };
    case actions.updateTodo:
      return { ...state };
    case actions.completeTodo:
      return { ...state };
    case actions.revertTodo:
      return { ...state };
    case actions.clearError:
      return { ...state };
    //if reducer recieves an action it does not recognize it will return the state as is with default
    default:
      return state;
  }
}

export { actions, initialState, reducer };
