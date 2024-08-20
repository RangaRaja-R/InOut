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
        return axios.post(API_URL + '' ,
            data,
        )
    }

    getAllUsers(){
        return axios.get(API_URL+'/all');
    }

    addOffSite(data,uid){
        return axios.post(API_URL,
            data,{
            params: {
                userid:uid
            }
        }
        )
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
export default new UserListService();