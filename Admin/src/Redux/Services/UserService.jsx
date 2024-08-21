import {API_URL} from '../store';
import axios from 'axios';
class UserListService{
    constructor(){
        this.apiUrl = API_URL;
        this.axios = axios.create({
            withCredentials:true
        })
        }
    postUser(data){
        return axios.post(API_URL +'/register',
            data,
        )
    }

    getAllUsers(){
        return axios.get(API_URL+'/all');
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
    addOffSite(data){
        return axios.post(API_URL+'/offsite',
            data
        );
    }

}
export default new UserListService();