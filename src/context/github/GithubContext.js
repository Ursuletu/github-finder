// Reducers can substitute useState.
import { type } from "@testing-library/user-event/dist/type";
import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Children are whatever you surround with the provider
export const GithubProvider = ({children}) => { 
  const inititialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, inititialState)

  // Get search results
  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text
    })

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, { // Fetch API doesn't throw errors for 400 and 500 responses. Should check in response that it doesn't fail and it actually returns 200
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    const {items} = await response.json()
    
    // Dispathes action to state - reducer takes aciton you dispatched and applies it to the state and returns the new state
    // React will change the state internally to whatever the function returned
    // Action is a piece of logic you apply to the state and it changes the state in some way. They use reducers which take the old state, an action, and the reducer returns the new state
    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
  }

  // Get single user
  const getUser = async (login) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`, { // Fetch API doesn't throw errors for 400 and 500 responses. Should check in response that it doesn't fail and it actually returns 200
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    if (response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json()
    
      dispatch({
        type: 'GET_USER',
        payload: data,
      })
    }
  }

  // Get user repos
  const getUserRepos = async (login) => {
    setLoading();

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10
    })

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })

    const data = await response.json()
    
    dispatch({
      type: 'GET_REPOS',
      payload: data,
    })
  }

  // Clear users from state
  const clearUsers = () => dispatch({ type: 'CLEAR_USERS'})

  //Set loading
  const setLoading = () => dispatch({type: 'SET_LOADING'})

  // Values we want to pass down to components go to value object
  return (
    <GithubContext.Provider 
      value={{ // Context gets value from nearest provider. Provider is instantiated and context gives you value of nearest provider
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
    }}
    >
      {children}
    </GithubContext.Provider>
  )
    
}

export default GithubContext