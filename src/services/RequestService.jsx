import config from '../config'
import RestTemplate from "./RestTemplate";

const uploadDocuments = (documents, refNumber) => {
    let uploadPromise = [];
    for (const key in documents) {
        if (documents[key].value !== undefined && documents[key].value !== null)
            uploadPromise.push(documentUpload(documents[key].value, documents[key].name, refNumber));
    }
    return uploadPromise;
}

const documentUpload = (file, name, refNumber) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('referenceNumber', refNumber);
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    return RestTemplate.post(config.rest.documentUpload, formData, headers)
    .then(() => { return { item: name, success: true } })
    .catch(() => {return { item: name, success: false } })
}

const saveRequestData = async (request, requestDocument) => {
    const formData = new FormData();
    formData.append('file', requestDocument);
    formData.append('name', request.name);
    formData.append('templateId', request.id);
    formData.append('json', JSON.stringify(request));

    const headers = {
        'Content-Type': 'multipart/form-data'
    }

    return RestTemplate.post(config.rest.requestDataSave, formData, headers);
}

const requestUploadLater = async (documentName, referenceNumber) => {
    return RestTemplate.post(config.rest.uploadRequired, { referenceNumber: referenceNumber, documentName: documentName});
}

export const RequestService = {

    uploadRequest: async (request, requestDocument) => {

        return saveRequestData(request, requestDocument)
        .then((referenceNumber) => {
            console.log("Save response", referenceNumber);
            if (request.upload){
                return Promise.all(uploadDocuments(request.upload, referenceNumber)).then((res)=>{
                    const errors = [];
                    for ( let i in res){
                        if (res[i] && res[i].success === false){
                            errors.push('Failed to upload: ' +res[i].item);
                            requestUploadLater(res[i].item, referenceNumber);
                        }
                    }
                    console.log(res);
                    return {referenceNumber: referenceNumber, error: errors}
                })
            }
            return { referenceNumber: referenceNumber };
        });
    },

    getRequestList: async () => {
        return await RestTemplate.get(config.rest.getRequestList);
    },

    getRequestByRef: async (referenceNumber) => {
        return await RestTemplate.get(config.rest.getRequestByRef + '/' + referenceNumber);
    },

    getRequestAttachmentList: async (referenceNumber) => {
        return await RestTemplate.get(config.rest.getRequestAttachmentList + '/' + referenceNumber);
    }
}

export default RequestService;