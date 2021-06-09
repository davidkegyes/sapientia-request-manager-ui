const { REACT_APP_REST_BASE_URL } = process.env;

const config = {};
config.rest = {};
config.rest.baseUrl = REACT_APP_REST_BASE_URL;
config.rest.getUserDetails = config.rest.baseUrl + "user/details";

config.rest.attachmentDelete = config.rest.baseUrl + "attachment";
config.rest.attachmentUpload = config.rest.baseUrl + "attachment/upload";
config.rest.attachmentList = config.rest.baseUrl + "attachment/list";

config.rest.approveRequest = config.rest.baseUrl + "request/approve";
config.rest.rejectRequest = config.rest.baseUrl + "request/reject";

config.rest.getRequestTemplates = config.rest.baseUrl + "request/templates";
config.rest.getRequestByRef = config.rest.baseUrl + "request"

config.rest.requestInfo = config.rest.baseUrl + "request/info"

config.rest.requestDataSave = config.rest.baseUrl + "request/save";
config.rest.requestInfoList = config.rest.baseUrl + "request/list"

config.rest.uploadFileSizeLimit = 1024;

export default config;