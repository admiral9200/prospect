'use client'

import { createContext, useReducer } from 'react'
import { reducer } from './reducer'
export const GlobalContext = createContext('init')

let data = {
    user: {},
    locale: '',
    workspace: [],
    user_workspace: [],
    selected_workspace: [],
    workspace_id: '',
    workspace_name: '',
    invited_members: []
}

const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, data)
    return <GlobalContext.Provider value={{ state, dispatch }} >
        {children}
    </GlobalContext.Provider>
}
export default ContextProvider
