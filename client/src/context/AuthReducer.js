
const AuthReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            };

        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
            
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            };
        case "REFRESH_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            };
        
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false
            };
        
        case "REGISTER_SUCCESS":
            return {
                user: null,
                isFetching: false,
                error: false
            }

        case "REGISTER_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            }

        case "EDIT_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }

        default:
            return state;
    }
}

export default AuthReducer;