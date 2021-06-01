const { REACT_APP_REST_BASE_URL } = process.env;

const config = {};
config.rest = {};
config.rest.baseUrl = REACT_APP_REST_BASE_URL;
config.rest.getUserDetails = config.rest.baseUrl + "user/details";

config.rest.getRequestTemplates = config.rest.baseUrl + "request/templates";
config.rest.documentUpload = config.rest.baseUrl + "request/attachment";
config.rest.requestDataSave = config.rest.baseUrl + "request/save";
config.rest.getRequestList = config.rest.baseUrl + "request/list";
config.rest.getRequestByRef = config.rest.baseUrl + "request"
config.rest.getRequestAttachmentList = config.rest.baseUrl + "request/attachments"
config.rest.uploadRequired = config.rest.baseUrl + "request/uploadRequired"

config.rest.getNewReqistryNumber = config.rest.baseUrl + "registry/getNewReqistryNumber";

export default config;