import axios from 'axios';

const executeRequest = async (method, url, data, headers) => {

    const token = JSON.parse(localStorage.getItem('token'));
        const headerConfig = {
            'Authorization': 'Bearer ' + token,
        }
        if (headers) {
            for (let h in headers) {
                headerConfig[h] = headers[h];
            }
        }
        return await axios({
            method: method,
            url: url,
            data: data,
            headers: headerConfig
        }).then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log("RestTemplate Error", err);
            if (err.response.status === 403 && window.location.pathname !== '/login'){
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
            }
            throw err;
        });
}

export const RestTemplate = {

    get: async (url, body, headers) => {
        return await executeRequest('get', url, body, headers);
    },

    post: async (url, body, headers) => {
        return await executeRequest('post', url, body, headers);
    },

    delete: async (url, body, headers) => {
        return await executeRequest("delete", url, body, headers);
    }
}

export default RestTemplate;