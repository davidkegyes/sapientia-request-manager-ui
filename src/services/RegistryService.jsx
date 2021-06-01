import RestTemplate from "./RestTemplate";
import config from '../config'

const RegistryService = {

    getNewRegistryNumber: async () => {
        return await RestTemplate.get(config.rest.getNewReqistryNumber).then(res => res);
    }

}

export default RegistryService;