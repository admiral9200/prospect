export const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, user: action.payload }
        case "LOCALE":
            return { ...state, locale: action.payload }
        case "WORKSPACE":
            return { ...state, workspace: action.payload }
        case "USER_WORKSPACE":
            return { ...state, user_workspace: action.payload }
        case "SELECTED_WORKSPACE":
            return { ...state, selected_workspace: action.payload }
        case "WORKSPACE_ID":
            return { ...state, workspace_id: action.payload }
        case "WORKSPACE_NAME":
            return { ...state, workspace_name: action.payload }
        case "INVITED_MEMBERS":
            return { ...state, invited_members: action.payload }
        default:
            return state
    }
}
