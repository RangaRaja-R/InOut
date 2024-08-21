const initialState={
    deplist:[],
    loading:false,
}

export default function departmentListReducer( state=initialState, action) {
    switch (action.type){
        case "LOADING":
            return{
                ...state,
                deplist:[],
                loading:true,
            }
        case "SET_ALL_DEP":
            return{
                ...state,
                deplist: action.payload,
                loading: false,
            }
        case "EMPTY_DEP":
            return{
                deplist:[],
                loading:false,
            }
        default:
            return state;
    }
}