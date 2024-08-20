import {API_URL} from '../store';
import axios from 'axios'
class UserListService{
    UserListService(){
        this.axios = axios({
            withCredentials:true
        })
    }

    postUser(data){
        return axios.post(API_URL + '' ,
            data,
        )
    }

    getAllUsers(){
        return axios.get(API_URL);
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

}
export default new UserListService();