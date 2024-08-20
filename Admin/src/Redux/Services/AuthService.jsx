import axios from "axios";
import { API_URL } from "../store";

class AuthService{
    constructor(){
        this.axios = axios.create({
            withCredentials:true
        })
    }
    login(email,password){
        return this.axios.post(API_URL+'/company/login',{
            email,
            password
        })
    }
    logout(){
        return this.axios.post(API_URL+'/company/logout');
    }
}
export default new AuthService();