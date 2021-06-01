import axios from 'axios'
import config from '../config'
export default class AuthorizationService {

    static async storeToken(token) {
        localStorage.setItem('token', JSON.stringify(token));
    }

    static reset = () => {
        localStorage.removeItem('token');
    }

    static async isTokenValid(token) {
        return await axios.get(config.rest.getUserDetails, { headers: this.getAuthHeader(token)})
            .then(true)
            .catch(false);
    }

    static async isUserLoggedIn() {
        return await axios.get(config.rest.getUserDetails, { headers: this.getAuthHeader() })
            .then(res => res.data);
    }

    static getAuthHeader = (provided) => {
        let token = provided === undefined ? JSON.parse(localStorage.getItem('token')) : provided;
        if (token) {
            return { 'Authorization': 'Bearer ' + token };
        } else {
            return {};
        }
    }
}