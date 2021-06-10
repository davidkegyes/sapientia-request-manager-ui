import config from '../config'
import RestTemplate from "./RestTemplate";

export const RequestService = {

    uploadRequest: async (request, requestDocument) => {
        const formData = new FormData();
        formData.append('file', requestDocument);
        formData.append('name', request.name);
        formData.append('templateId', request.id);
        formData.append('json', JSON.stringify(request));
    
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
    
        return RestTemplate.post(config.rest.requestDataSave, formData, headers);
    },

    approve: async (referenceNumber) => {
        return RestTemplate.post(config.rest.approveRequest + "/" + referenceNumber);
    },

    reject: async (referenceNumber) => {
        return RestTemplate.post(config.rest.rejectRequest + "/" + referenceNumber);
    },

    getRequestInfo : async (referenceNumber) => {
        return await RestTemplate.get(config.rest.requestInfo + "/" + referenceNumber);
    },

    getrequestInfoList: async () => {
        return await RestTemplate.get(config.rest.requestInfoList);
    },

    getRequestByRef: async (referenceNumber) => {
        return await RestTemplate.get(config.rest.getRequestByRef + '/' + referenceNumber);
    }
}

export default RequestService;