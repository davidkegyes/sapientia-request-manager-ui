import RestTemplate from "./RestTemplate";
import config from '../config'

export const getUserDetails = async () => {
    return await RestTemplate.get(config.rest.getUserDetails).then(res => res);
}

export const getUsers = async () => {
    return await RestTemplate.get(config.rest.getUsers).then(res => res);
}

export const saveUser = async (user) => {
    return await RestTemplate.post(config.rest.saveUser, user);
}

export const hasPermission = (user, permission) => {
    return user && (user.role.name === permission || user.role.permissions.includes(permission));
}