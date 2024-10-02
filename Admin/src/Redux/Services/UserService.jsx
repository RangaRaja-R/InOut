import {API_URL} from '../store';
import axios from 'axios';
class UserListService{
    constructor(){
        this.apiUrl = API_URL;
        this.axios = axios.create({
            withCredentials:true
        })
        }
}
export default new UserListService();