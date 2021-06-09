import config from '../config'
import RestTemplate from "./RestTemplate";

const AttachmentService = {

    getListForRequestReferenceNumber: async (referenceNumber) =>{
        return await RestTemplate.get(config.rest.attachmentList + '/' + referenceNumber);
    },

    delete: async (referenceNumber) => {
        return await RestTemplate.delete(config.rest.attachmentDelete + '/' + referenceNumber)
    },

    uploadAttachment: async (refNumber, name, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('requestReferenceNumber', refNumber);
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        return RestTemplate.post(config.rest.attachmentUpload, formData, headers);
    },

    upload : async (refNumber, attachment) => {
        const formData = new FormData();
        formData.append('file', attachment.value);
        formData.append('name', attachment.name);
        formData.append('requestReferenceNumber', refNumber);
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        return RestTemplate.post(config.rest.attachmentUpload, formData, headers)
            .then((res) => {
                attachment.uploadSuccess =true; 
                attachment.refNumber=refNumber; 
                attachment.err = res;
                return attachment;
            })
            .catch((err) => {
                attachment.err = err.message;
                let errorMessage = "Error during fileUpload. Please retry with a different file or try again later on the Request View Page.";
                if (err.response.status !== 500 && err.response.data !== undefined && err.response.data.message !== undefined && err.response.data.message !== '') {
                    errorMessage = err.response.data.message;
                }
                attachment.errors = [errorMessage];
                attachment.uploadSuccess=false; 
                attachment.refNumber=refNumber; 
                return attachment;
            });
    }
}

export default AttachmentService;