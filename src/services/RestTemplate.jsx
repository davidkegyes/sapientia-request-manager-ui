import axios from 'axios'

const executeRequest = async (method, url, data, headers) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
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
        });
        // .catch((err) => {
        //     console.log("RestTemplate Error", err);
        //     localStorage.clear();
        //     if (err.response.status === 403) {
        //         return Promise.reject({ redirectTo: '/login' });
        //     }
        // });
    }
}

export const RestTemplate = {

    get: async (url, body, headers) => {
        return executeRequest('get', url, body, headers);
    },

    post: async (url, body, headers) => {
        return executeRequest('post', url, body, headers);
    },

    delete: async (url, body, headers) => {
        return executeRequest("delete", url, body, headers);
    }
}

export default RestTemplate;