import React, { Component } from "react";
import { Container, Row, Button, Col, Alert } from "react-bootstrap";
import RequestForm from "../components/RequestForm"
import UploadComponent from "../components/UploadComponent"
import './RequestPage.css'
import RequestService from "../services/RequestService";
import LoadingModal from "../components/LoadingModal";
import RequestUploadSuccess from "./RequestUploadSuccess";
import RequestPDFService from '../services/RequestPDFService';
import moment from "moment";
export default class RequestPage extends Component {

    initialState = { request: {} , errors: [], loading: false }

    constructor(props) {
        super(props);
        this.pdfService = new RequestPDFService();
        this.initialState.request = props.template;
        this.state = { request: props.template, errors: [], loading: false };
        this.uploadApplication = this.uploadApplication.bind(this);
        this.uploadApplicationError = this.uploadApplication.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.conditionalRender  = this.conditionalRender.bind(this);
        this.reset = this.reset.bind(this);
        this.uploadService = props.uploadService;
    }

    isValid() {
        let errors = [];
        this.state.request.upload.forEach((doc) => {
            if (doc.value === undefined) {
                errors.push("Documentul " + doc.name + " trebuie incarcat!");
            }
        });
        this.state.request.form.forEach((part) => {
            if (part.variables !== undefined) {
                part.variables.forEach((variable) => {
                    if (variable.value === undefined) {
                        errors.push(variable.error);
                    }
                });
            }
            if (part.type === 'signature' && part.value === undefined) {
                errors.push("The request must be signed!");
                // } else if (part.type === 'customText' && part.value === undefined) {
                // errors.push("The request must be signed!");
            }

        });
        return errors;
    }

    handleChange(event) {
        const { name, value, type, files } = event.target;
        let tmpRequest = this.state.request;
        if (type === 'file') {
            for (let i in tmpRequest.upload) {
                if (tmpRequest.upload[i].name === name) {
                    tmpRequest.upload[i].value = files[0];
                    break;
                }
            }
        } else {
            let formParts = tmpRequest.form;
            for (let i in formParts) {
                if (type === 'dateAndSignature' && formParts[i].type === type) {
                    formParts[i].signatureValue = value;
                    formParts[i].dateValue = moment().format("YYYY-MM-DD");
                    break;
                } else if (type === 'textarea' && formParts[i].type === 'customText' && formParts[i].name === name) {
                    formParts[i].value = value;
                    break;
                } else {
                    if (formParts[i].variables === undefined) {
                        continue;
                    }
                    let filled = false;
                    for (let v in formParts[i].variables) {
                        if (formParts[i].variables[v].name === name) {
                            formParts[i].variables[v].value = value;
                            filled = true;
                            break;
                        }
                    }
                    if (filled) {
                        break;
                    }
                }
            }
        }
        this.setState({ request: tmpRequest });
    }

    uploadApplication() {
        let errors = this.isValid();
        if (errors.length > 0) {
            this.setState({ errors: errors });
        } else {
            this.pdfService.getRequestPdfFile(this.state.request.form, this.state.request.name).then((file) =>{
                RequestService.uploadRequest(this.state.request, file, this.uploadApplicationError)
                    .then((res) => { 
                        console.log(res); 
                        this.setState({ loading: false, errors: [res.error], success: true, refNumber: res.referenceNumber })
                    })
                    .catch((error) => { console.log(error); this.setState({ errors: [error.message], loading: false }) });
                this.setState({ loading: true })
            });
        }
    }

    reset(){
        // not working
        this.setState(this.initialState);
        this.forceUpdate();
    }

    conditionalRender () {
        if (this.state.success) {
            return (<RequestUploadSuccess refNumber={this.state.refNumber} errors={this.state.errors} />);
        } else {
            return (
                <>
                    {this.state.errors.map((error) => (
                        <Row className="rowSpace">
                            <Col>
                                <Alert key={error} variant='danger'>{error}</Alert>
                            </Col>
                        </Row>
                    ))}
                    <RequestForm request={this.state.request.form} handleChange={this.handleChange} />
                    <UploadComponent upload={this.state.request.upload} handleChange={this.handleChange} />
                    <Row className="rowSpace formMainControls">
                        <Col><Button variant="primary" onClick={() => this.pdfService.downloadPdf(this.state.request.form, this.state.request.name)}>Download without Sending</Button></Col>
                        <Col><Button variant="primary" onClick={this.reset}>Reset</Button></Col>
                        <Col xs="auto"><Button variant="success" onClick={(e) => this.uploadApplication(this.state.request)}>Send</Button></Col>
                    </Row>
                </>
            )
        }
    }

    render() {
        return (
            <Container>
                <Row className="rowSpace">
                    <Col>
                        <Button onClick={this.props.close}>Back To Templates</Button>
                    </Col>
                </Row>
                {this.conditionalRender ()}
                <LoadingModal show={this.state.loading} />
            </Container>
        );
    }
}