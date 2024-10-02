import { API_URL } from '../store';
import axios from 'axios';
class AuthService {
    constructor() {
        this.apiUrl = API_URL;
        this.axios = axios.create({
            withCredentials: true
        })
    }
    login(email, password) {
        return this.axios.post(API_URL + '/login', {
            email,
            password
        })
    }
    logout() {
        return this.axios.post(API_URL + '/company/logout');
    }
    postUser(data) {
        return this.axios.post(API_URL + '/register',
            data,
        )
    }

    getAllUsers() {
        return this.axios.get(API_URL + '/all');
    }



    addOffSite(data) {
        return this.axios.post(API_URL + '/offsite',
            data
        );

    }
    validate(email) {
        return this.axios.post(API_URL + '/validate', { "email": email });
    }



}
export default new AuthService();