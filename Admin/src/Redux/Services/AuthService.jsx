import {API_URL} from '../store';
import axios from 'axios';
class AuthService{
    constructor(){
        this.apiUrl = API_URL;
        this.axios = axios.create({
            withCredentials:true
        })
    }
    login(email,password){
        return axios.post(API_URL+'/company/login',{
            email,
            password
        })
    }
    logout(){
        return axios.post(API_URL+'/company/logout');
    }
    
}
export default new AuthService();