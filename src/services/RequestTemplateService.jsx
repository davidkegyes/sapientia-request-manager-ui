import RestTemplate from "./RestTemplate";
import config from '../config'

const RequestsTemplateService = {
    getTemplateByUuid : async (uuid) => {
        return RestTemplate.get(config.rest.getTemplateByUuid + "/" + uuid);
    },
    getRequestTemplates : async () => {
        return RestTemplate.get(config.rest.getRequestTemplates).then(res => res);
    },
    saveTemplate : async (template) => {
        return RestTemplate.post(config.rest.saveRequestTemplate, template);
    },
    deleteTemplate : async (uuid) => {
        return RestTemplate.delete(config.rest.deleteRequestTemplate + "/" + uuid);
    }
}

export default RequestsTemplateService;