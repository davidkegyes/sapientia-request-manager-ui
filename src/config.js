const { REACT_APP_REST_BASE_URL } = process.env;

const config = {};
config.rest = {};
config.rest.baseUrl = REACT_APP_REST_BASE_URL;
config.rest.getUserDetails = config.rest.baseUrl + "user/details";

config.rest.attachmentUpload = config.rest.baseUrl + "attachment/upload";
config.rest.attachmentList = config.rest.baseUrl + "attachment/list";

config.rest.approveRequest = config.rest.baseUrl + "request/approve";

config.rest.getRequestTemplates = config.rest.baseUrl + "request/templates";
config.rest.requestDataSave = config.rest.baseUrl + "request/save";
config.rest.getRequestByRef = config.rest.baseUrl + "request"
config.rest.requestList = config.rest.baseUrl + "request/list"

config.rest.uploadRequired = config.rest.baseUrl + "request/uploadRequired"

config.rest.uploadFileSizeLimit = 1024;

export default config;