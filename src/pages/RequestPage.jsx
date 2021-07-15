import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";
import RequestForm from "../components/RequestForm"
import LoadingModal from "../components/LoadingModal";
import RequestService from "../services/RequestService";
import {Link, NavLink, Redirect, useParams} from 'react-router-dom';
import './RequestPage.css'
import {downloadPdf, getRequestPdfFile} from '../services/RequestPDFService';
import {useTranslation} from "react-i18next";
import RequestTemplateService from "../services/RequestTemplateService";

export default function RequestPage() {

    const params = useParams();

    const {t} = useTranslation();
    const [request, setRequest] = useState(null);
    const [referenceNumber, setReferenceNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [goTo404, setGoTo404] = useState(false);

    useEffect(() => {
        const getRequestTemplate = async (uuid) => {
            setLoading(true)
            if (uuid !== undefined && uuid !== null && uuid !== '') {
                try {
                    const template = await RequestTemplateService.getTemplateByUuid(uuid);
                    setRequest(template);
                } catch (err) {
                    console.log(err);
                    setGoTo404(true);
                }
            }
            setLoading(false);
        }
        getRequestTemplate(params.uuid)
    }, [params.ref])

    if (goTo404 === true) {
        return (<Redirect to={
            {
                pathname: '/',
                state: {
                    from: ''
                }
            }
        }/>)
    }

    if (request === null) {
        return (<LoadingModal show={true}/>)
    }

    const getValidatedRequest = () => {
        let hasErrors = false;
        let tmpRequest = {...request};
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

        }
        ;
        tmpRequest.hasErrors = hasErrors;
        return tmpRequest;
    }

    const handleFormChange = (requestForm) => {
        let tmpRequest = {...request};
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

    console.log(request)
    return (
        <Container>
            <Row>
                <Col><h2>{request.name}</h2></Col>
                <Col md='auto'>
                    <Link className="btn btn-outline-info" to="/">{t("page.requestPage.back")}</Link>
                </Col>
            </Row>
            {referenceNumber === null &&
            <>
                <RequestForm form={request.form} onChange={handleFormChange}/>
                <Row className="rowSpace formMainControls">
                    <Col><Button variant="primary" onClick={() => downloadPdf(request.form, request.name)}>Kérvény
                        Letöltése küldés nélkül</Button></Col>
                    <Col xs="auto"><Button variant="success"
                                           onClick={(e) => uploadRequest(request)}>Küldés</Button></Col>
                </Row>
            </>
            }
            {referenceNumber &&
            <Row>
                <Col>
                    <Alert
                        variant={request.requiredDocuments && request.requiredDocuments.length > 0 ? "warning" : "success"}>
                        <Alert.Heading>
                            {t("request.requestUploadSuccessTitle")}
                        </Alert.Heading>
                        {request.requiredDocuments && request.requiredDocuments.length > 0 &&
                        <p>Upload required, go to request and upload the required files</p>}
                        <p>{t("request.requestUploadSuccessMessage")}</p>
                        <hr/>
                        <NavLink to={"/inspect/" + referenceNumber}
                                 className='btn btn-outline-info ml-auto'>{t("request.navigateToRequestButton")}</NavLink>
                    </Alert>
                </Col>
            </Row>
            }
            <LoadingModal show={loading}/>
        </Container>
    )
}