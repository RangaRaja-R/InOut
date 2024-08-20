const initialState={
    user:null,
    userType:null
}

const AuthReducer=(state=initialState,action)=>{
    switch(action.type){
        case "SET_USER":
            return {
                ...state,
                user:action.payload
            };
        case "SET_USER_TYPE":
            return {
                ...state,
                userType:action.payload
            }
        case "LOG_OUT":
            return{
                user:null,
                userType:null
            }
        default:
            return state;
    }
}
export default AuthReducer;