const { REACT_APP_REST_BASE_URL } = process.env;

const config = {};
config.rest = {};
config.rest.baseUrl = REACT_APP_REST_BASE_URL;

config.rest.getRoles = config.rest.baseUrl + "role/list";

config.rest.getUserDetails = config.rest.baseUrl + "user/details";
config.rest.getUsers = config.rest.baseUrl + "user/list";
config.rest.saveUser = config.rest.baseUrl + "user";

config.rest.attachmentDelete = config.rest.baseUrl + "attachment";
config.rest.attachmentUpload = config.rest.baseUrl + "attachment/upload";
config.rest.requiredDocuments = config.rest.baseUrl + "attachment/list";

config.rest.approveRequest = config.rest.baseUrl + "request/approve";
config.rest.rejectRequest = config.rest.baseUrl + "request/reject";

config.rest.getRequestByRef = config.rest.baseUrl + "request"

config.rest.requestInfo = config.rest.baseUrl + "request/info"

config.rest.requestDataSave = config.rest.baseUrl + "request/save";
config.rest.requestInfoList = config.rest.baseUrl + "request/list"

config.rest.getRequestTemplates = config.rest.baseUrl + "template/list";
config.rest.saveRequestTemplate = config.rest.baseUrl + "template/save";
config.rest.deleteRequestTemplate = config.rest.baseUrl + "template/delete";
config.rest.getTemplateByUuid = config.rest.baseUrl + "template";

config.rest.uploadFileSizeLimit = 1024;

export default config;