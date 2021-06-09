import React, { Component } from "react";
import { Container, Row, Button, Col, Alert } from "react-bootstrap";
import RequestForm from "../components/RequestForm"
import RequestFormUploadComponent from "../components/RequestFormUploadComponent"
import LoadingModal from "../components/LoadingModal";
import RequestService from "../services/RequestService";
import RequestPDFService from '../services/RequestPDFService';
import AttachmentService from "../services/AttachmentService";
import config from "../config";
import './RequestPage.css'

export default class RequestPage extends Component {

    initialState = {
        loading: false, 
        request: {}, 
        refNumber: ''
    }
    requestForm = {}
    RequestFormUploadComponents = [];

    constructor(props) {
        super(props);
        this.pdfService = new RequestPDFService();
        this.state = { ...this.initialState };
        this.state.request = props.template;


        this.uploadRequest = this.uploadRequest.bind(this);
        this.getValidatedRequest = this.getValidatedRequest.bind(this);
        this.reset = this.reset.bind(this);
        this.uploadService = props.uploadService;

        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);

        this.isSuccess = this.isSuccess.bind(this);
    }

    getValidatedRequest() {
        let hasErrors = false;
        let tmpRequest = this.state.request;
        for (let i in tmpRequest.attachmentList) {
            tmpRequest.attachmentList[i].errors = [];
            if (tmpRequest.attachmentList[i].value === undefined) {
                tmpRequest.attachmentList[i].errors.push("Fisierul \"" + tmpRequest.attachmentList[i].name + "\" trebuie incarcat!");
                hasErrors = true;
            }else if (tmpRequest.attachmentList[i].value.size/1024 > config.rest.uploadFileSizeLimit) {
                tmpRequest.attachmentList[i].errors.push("Marimea fisierului \"" + tmpRequest.attachmentList[i].name + "\" depaseste limita de " + config.rest.uploadFileSizeLimit + " KB !");
                hasErrors = true;
            }
            // TODO more checks if required;
        }

        tmpRequest.form.errors = [];
        for (let i in tmpRequest.form) {
            if (tmpRequest.form[i].variables !== undefined) {
                for (let j in tmpRequest.form[i].variables) {
                    if (tmpRequest.form[i].variables[j].value === undefined) {
                        tmpRequest.form.errors.push(tmpRequest.form[i].variables[j].error);
                        hasErrors = true;
                    }
                }
            }
            if (tmpRequest.form[i].type === 'dateAndSignature' && tmpRequest.form[i].signatureValue === undefined) {
                tmpRequest.form.errors.push("The request must be signed!");
                hasErrors = true;
            }

        };
        tmpRequest.hasErrors = hasErrors;
        return tmpRequest;
    }

    handleFormChange(requestForm) {
        let tmpRequest = { ...this.state.request };
        tmpRequest.form = requestForm;
        this.setState({ request: tmpRequest });
    }

    handleAttachmentChange(attachment) {
        let tmpRequest = { ...this.state.request };
        for (let i in tmpRequest.attachmentList) {
            if (tmpRequest.attachmentList[i].name === attachment.name) {
                tmpRequest.attachmentList[i] = attachment;
            }
        }
        this.setState({ request: tmpRequest });
    }

    uploadRequest() {
        let request = this.getValidatedRequest();
        if (!request.hasErrors) {
            this.setState({ loading: true });
            if (this.state.refNumber !== '') {
                this.uploadAttachments(this.state.refNumber);
            } else {
                this.setState({ loading: true });
                this.pdfService.getRequestPdfFile(this.state.request.form, this.state.request.name)
                    .then((file) => {
                        RequestService.uploadRequest(this.state.request, file)
                            .then((refNumber) => {
                                if (this.state.request.attachmentList && this.state.request.attachmentList.length > 0) {
                                    this.uploadAttachments(refNumber);
                                } else {
                                    this.setState({ loading: false, refNumber: refNumber })
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                let tmp = { ...this.state.request };
                                tmp.form.errors = ["Error during the request upload"];
                                this.setState({ loading: false, request: tmp })
                            });
                        this.setState({ loading: true })
                    }).catch((error) => {
                        console.log(error)
                        let tmp = { ...this.state.request };
                        tmp.form.errors = ["Error during the pdf generation, please report this error."];
                        this.setState({ loading: false, request: tmp })
                    });
            }
        }
        this.setState({ request: request })
    }

    uploadAttachments(refNumber) {
        let attList = this.state.request.attachmentList;
        let promises = []
        for (let i in attList) {
            if (attList[i].uploadSuccess) {
                continue
            }
            promises.push(AttachmentService.upload(refNumber, attList[i]))
        }
        Promise.all(promises)
            .then((res) => {
                let tmp = { ...this.state.request };
                let uploadSuccess = true;//res.every(u => u.uploadSuccess === true); 
                for (let i in res) {
                    uploadSuccess = uploadSuccess && res[i].uploadSuccess;
                    for (let j in tmp.attachmentList) {
                        if (res[i].name === tmp.attachmentList[j].name) {
                            tmp[j] = res[i];
                        }
                    }
                }
                this.setState({ loading: false, request: tmp, attUploadSuccess: uploadSuccess, refNumber: refNumber })
            })
    }


    reset() {
        let resetTemplate = { ...this.state.request };
        for (let i in resetTemplate.form) {
            let formPart = resetTemplate.form[i];
            if (formPart.type === 'text' && formPart.variables) {
                for (let j in formPart.variables) {
                    formPart.variables[j].value = undefined;
                }
            } else if (formPart.type === 'customText') {
                formPart.value = undefined;
            }
            // else if (formPart.type === 'dateAndSignature') {
            //     formPart.signatureValue = undefined;
            // }
        }
        // sigPad.clear();
        this.setState({ request: resetTemplate, errors: [] });
    }

    isSuccess(){
        return !(this.state.refNumber === '' || (this.state.attUploadSuccess === false && this.state.request.attachmentList));
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h2>{this.state.request.name}</h2></Col>
                    <Col md='auto'>
                        <Button onClick={this.props.close}>Vissza a kérvényekhez</Button>
                    </Col>
                </Row>
                { this.state.refNumber !== '' &&
                    <Alert variant={this.isSuccess() ? 'success' : 'warning'}>
                        <Alert.Heading>{this.isSuccess() ? 'Sikeres feltöltés' : 'Hibás feltöltés'}</Alert.Heading>
                        <p>Request form uploaded successfully with reference number {this.state.refNumber}</p>
                        {this.state.attUploadSuccess === false &&
                            <>
                                <p><strong>!!!</strong> Error with the attachments. Please try to choose a different file and/or send again!</p>
                                <p>Or you can can retry to attach the required documents on the Request review page.</p>
                            </>
                        }
                    </Alert>}
                { this.state.refNumber === '' && <RequestForm form={this.state.request.form} onChange={this.handleFormChange} />}
                { (this.state.request.attachmentList && this.state.request.attachmentList.length > 0) &&
                    this.state.request.attachmentList.map(att => {
                        return <RequestFormUploadComponent key={att.name} doc={att} upload={this.state.upload} onChange={this.handleAttachmentChange} />
                    })
                }
                <Row className="rowSpace formMainControls">
                    { this.state.refNumber === '' &&
                        <>
                            <Col><Button variant="primary" onClick={() => this.pdfService.downloadPdf(this.state.request.form, this.state.request.name)}>Kérvény Letöltése küldés nélkül</Button></Col>
                            {/* <Col><Button variant="primary" onClick={this.reset}>Reset</Button></Col> */}
                        </>}
                    { !this.isSuccess() && 
                        <Col xs="auto"><Button variant="success" onClick={(e) => this.uploadRequest(this.state.request)}>Küldés</Button></Col>
                    }
                </Row>
                <LoadingModal show={this.state.loading} />
            </Container>
        );
    }
}