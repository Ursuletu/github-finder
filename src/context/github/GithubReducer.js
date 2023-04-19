const githubReducer = (state, action) => {
  switch(action.type) {
    case 'GET_USERS':
      return {
        ...state, // See how spread operator applies to arrays and objects (slightly different) - object.assign
        users: action.payload,
        loading: false,
      }
    case 'GET_USER':
      return{
        ...state,
        user: action.payload,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'CLEAR_USERS':
      return {
        ...state,
        users: [],
      }
    case 'GET_REPOS':
      return {
        ...state,
        repos: action.payload,
        loading: false,
      }
    default: 
      return state
  }
}

export default githubReducer