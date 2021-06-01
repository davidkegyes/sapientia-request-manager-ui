import RestTemplate from "./RestTemplate";
import config from '../config'

const RequestsTemplateService = {
    getRequestTemplates : async () => {
        return RestTemplate.get(config.rest.getRequestTemplates).then(res => res);
    } 
}

export default RequestsTemplateService;