import React, { useState } from "react";
import { Container, Row, Button, Col, Alert } from "react-bootstrap";
import RequestForm from "../components/RequestForm"
import LoadingModal from "../components/LoadingModal";
import RequestService from "../services/RequestService";
import { NavLink } from 'react-router-dom';
import './RequestPage.css'
import { downloadPdf, getRequestPdfFile } from '../services/RequestPDFService';
import UploadComponent from '../components/UploadComponent'
import { useTranslation } from "react-i18next";
export default function RequestPage({ template, onClose }) {

    const { t } = useTranslation();
    const [request, setRequest] = useState(template);
    const [referenceNumber, setReferenceNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const getValidatedRequest = () => {
        let hasErrors = false;
        let tmpRequest = { ...request };
        tmpRequest.form.errors = [];
        for (let i in tmpRequest.form) {
            if (tmpRequest.form[i].variables !== undefined) {
                for (let j in tmpRequest.form[i].variables) {
                    if (tmpRequest.form[i].variables[j].value === undefined) {
                        tmpRequest.form.errors.push(tmpRequest.form[i].variables[j].hint);
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

    const handleFormChange = (requestForm) => {
        let tmpRequest = { ...request };
        tmpRequest.form = requestForm;
        setRequest(tmpRequest);
    }

    const uploadRequest = () => {
        let tmpRequest = getValidatedRequest();
        if (!tmpRequest.hasErrors) {
            setLoading(true);
            getRequestPdfFile(tmpRequest.form, tmpRequest.name)
                .then((file) => {
                    RequestService.uploadRequest(tmpRequest, file)
                        .then((refNumber) => {
                            setReferenceNumber(refNumber);
                            setLoading(false);
                        })
                        .catch((error) => {
                            console.log(error);
                            tmpRequest.form.errors = ["Error during the request upload"];
                            setRequest(tmpRequest);
                            setLoading(false);
                        });
                }).catch((error) => {
                    console.log(error)
                    tmpRequest.form.errors = ["Error during the pdf generation, please report this error."];
                    setRequest(tmpRequest);
                    setLoading(false);
                });
        } else {
            setRequest(tmpRequest);
        }
    }
    return (
        <Container>
            <Row>
                <Col><h2>{request.name}</h2></Col>
                <Col md='auto'>
                    <Button variant="outline-info" onClick={() => onClose()}>{t("page.requestPage.back")}</Button>
                </Col>
            </Row>
            {referenceNumber === null &&
                <>
                    <RequestForm form={request.form} onChange={handleFormChange} />
                    <Row className="rowSpace formMainControls">
                        <Col><Button variant="primary" onClick={() => downloadPdf(request.form, request.name)}>Kérvény Letöltése küldés nélkül</Button></Col>
                        <Col xs="auto"><Button variant="success" onClick={(e) => uploadRequest(request)}>Küldés</Button></Col>
                    </Row>
                </>
            }
            {referenceNumber &&
                <Row>
                    <Col>
                        <Alert variant={request.requiredDocuments && request.requiredDocuments.length > 0 ? "warning":"success"}>
                            <Alert.Heading>
                                {t("request.requestUploadSuccessTitle")}
                            </Alert.Heading>
                            {request.requiredDocuments && request.requiredDocuments.length > 0 && <p>Upload required, go to request and upload the required files</p>}
                            <p>{t("request.requestUploadSuccessMessage")}</p>
                            <hr />
                            <NavLink to={"/inspect/" + referenceNumber} className='btn btn-outline-info ml-auto'>{t("request.navigateToRequestButton")}</NavLink>
                        </Alert>
                    </Col>
                </Row>
            }
            <LoadingModal show={loading} />
        </Container>
    )
}