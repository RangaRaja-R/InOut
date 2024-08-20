const initialState={
    users:[],
    loading:false,

}

export default function UserListReducer(state=initialState,action){
    switch(action.type){
        case "SET_ALL_USERS":
            return {
                ...state,
                users:action.payload,
                loading:false
            }
        case "EMPTY_USERS":
            return {
                users:[],
                loading:false
            }
        case "LOADING":
            return{
                ...state,
                users:[],
                loading:true,
            }

        default:
            return state;
    }
            
}