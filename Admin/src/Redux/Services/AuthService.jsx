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
    async getQrCode(email) {
        try {
            // Set responseType to 'blob' to correctly handle the binary data
            const res = await this.axios.get(API_URL + "/get-code/" + email, {
                responseType: 'blob' // Expect a Blob response
            });
            
            const blob = res.data; // The response data will be a Blob
            const imageObjectUrl = URL.createObjectURL(blob); // Create an object URL from the Blob
            return imageObjectUrl; // Return the image URL
        } catch (error) {
            console.error('Error fetching QR code:', error);
            throw error; // Rethrow the error for further handling if needed
        }
    }
    



}
export default new AuthService();