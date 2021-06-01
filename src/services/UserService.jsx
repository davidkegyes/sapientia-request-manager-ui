import RestTemplate from "./RestTemplate";
import config from '../config'

const UserService = {
    getUserDetails: async () => {
        return await RestTemplate.get(config.rest.getUserDetails).then(res => res);
    }
}

export default UserService;