import axios from "axios";
import { API_URL } from "../store";

class AuthService{
    AuthService(){
        this.axios = axios({
            withCredentials:true
        })
    }
    login(email,password){
        return axios.post(API_URL+'/company/login',{
            email,
            password
        })
    }
}
export default new AuthService();