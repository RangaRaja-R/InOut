import Serv from '../Services/AuthService';
const serv=Serv;


export const login=(data)=>async(dispatch,getState)=>{
    console.log(data);
    try{
        const res=await serv.login(data.email,data.password);
        dispatch({type:"SET_USER",payload:res.data});
        dispatch({type:"SET_USER_TYPE",payload:"hr"});
    }
    catch(er){
        console.log(er);
    }
}