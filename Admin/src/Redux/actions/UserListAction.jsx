import UserService from "../Services/UserService";
const serv = UserService;

export const postUser=(data)=>async (dispatch,getstate)=>{
    try{
        const response = await serv.postUser(data);
        if(response.status === 201){
            getAllUsers();
        }
        else{
            console.log("error on post");
        }
    }
    catch(er){
        console.log("error on u1 post");
        console.log(er);
    }
}


export const getAllUsers=()=>async(dispatch,getstate)=>{
    try{
        const res=await serv.getAllUsers();
        if(res.status === 200){
            console.log(res.data);
            dispatch({type:"SET_ALL_USERS",payload:res.data})
        }
    }
    catch(er){
        console.log(er);
    }
}
export const addOffSite=(data)=>async(dispatch,getstate)=>{
    try{
        const response = await serv.addOffSite(data);
        if(response.status === 201){
            getAllUsers();
            }
        
    }
    catch(er){
        console.log(er);
    }
}