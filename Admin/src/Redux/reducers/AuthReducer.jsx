const initialState={
    user:null,
    userType:null,
    validate_msg: null,
    img:null,
    today:null,
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
        case "VALIDATE_MSG":
            return{
                ...state,
                validate_msg:action.payload
                }
        case "ADD_IMG":
            return {
                ...state,
                img:action.payload
            }
        case "DEL_IMG":
            return{
                ...state,
                img:null
            }
        case "TODAY":
            return{
                ...state,
                today:action.payload
            }
        default:
            return state;
    }
}
export default AuthReducer;