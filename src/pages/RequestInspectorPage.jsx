import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal'
import RequestService from '../services/RequestService'
import DocumentViewComponent from '../components/DocumentViewComponent';
import AttachmentService from '../services/AttachmentService';
import UploadComponent from '../components/UploadComponent';
import { useTranslation } from 'react-i18next';
import Restricted from '../components/Restricted';
import { saveAs } from 'file-saver';

const splitRequestObject = (request) => {
    let info = { ...request };
    delete info.document;
    delete info.documentType;
    let doc = { documentType: request.documentType, document: request.document }
    return { info, doc };
}

export default function RequestInspectorPage() {

    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requestInfo, setRequestInfo] = useState(null);
    const [requestDocument, setRequestDocument] = useState(null);
    const [requiredDocuments, setRequiredDocuments] = useState(null);
    const [documentUpload, setDocumentUpload] = useState(false)
    const [action, setAction] = useState({ type: "INIT" });
    const { t } = useTranslation();

    const onUpload = useCallback(async () => {
        setLoading(true);
        setRequiredDocuments(await AttachmentService.getListForRequestReferenceNumber(params.ref));
        setLoading(false);
    })

    useEffect(()=> {
        console.log("effect upload", requiredDocuments)
        if (requiredDocuments != null && requestInfo.requiredDocuments != null) {
            const uploadList = [];
            const uploaded = requiredDocuments.map(rd => rd.name);
            for (const d in requestInfo.requiredDocuments) {
                if (!uploaded.includes(requestInfo.requiredDocuments[d])){
                    uploadList.push(requestInfo.requiredDocuments[d]);
                }
            }
            setDocumentUpload(uploadList);
        }
    }, [requiredDocuments])

    useEffect(() => {
        async function doAction() {
            setLoading(true);
            try {
                switch (action.type) {
                    case "INIT":
                        const request = await RequestService.getRequestByRef(params.ref);
                        const { info, doc } = splitRequestObject(request);
                        setRequestInfo(info);
                        setRequestDocument(doc);
                        setRequiredDocuments(await AttachmentService.getListForRequestReferenceNumber(params.ref));
                        break;
                    case "APPROVE":
                        await RequestService.approve(params.ref);
                        setRequestInfo(await RequestService.getRequestInfo(params.ref));
                        break;
                    case "REJECT":
                        await RequestService.reject(params.ref);
                        setRequestInfo(await RequestService.getRequestInfo(params.ref));
                        break;
                    case "DELETE_ATTACHMENT":
                        await AttachmentService.delete(action.value);
                        setRequiredDocuments(requiredDocuments.filter((o) => o.uuid !== action.value))
                        break;
                    default:
                        setLoading(false);
                        break;
                }
            } catch (error) {
                console.log(error);
                setError(error);
            }
            setLoading(false);
        }
        doAction();
    }, [action])

    if (requestInfo === null || requestInfo === undefined) {
        return (<LoadingModal show={true} />);
    }

    const downloadRequest = async () => {
        const base64Response = await fetch(`data:${requestDocument.documentType};base64,${requestDocument.document.toString('base64')}`);
        const blob = await base64Response.blob();
        saveAs(blob, `${requestInfo.name}.${requestDocument.documentType.startsWith('image') ? 'jpg': 'pdf'}`)
    }

    return (
        <Container>
            <LoadingModal show={loading} />
            <Row className='align-items-center'>
                <Col md="auto">
                    <h3>
                        {requestInfo.status === 'NEW' && <Badge variant="primary">{t("request.status.new")}</Badge>}
                        {requestInfo.status === 'REJECTED' && <Badge variant="danger">{t("request.status.rejected")}</Badge>}
                        {requestInfo.status === 'APPROVED' && <Badge variant="success">{t("request.status.approved")}</Badge>}
                    </h3>
                </Col>
                <Col md="auto">
                    <h2>{requestInfo.name}</h2>
                </Col>
                <Col>
                    <Button variant='outline-primary' onClick={downloadRequest}>Download</Button>
                </Col>
                <Col className='d-flex align-items-center'>
                    <NavLink to="/myRequests" className='btn btn-outline-info ml-auto'>{t("page.requestInspector.button.backToMyRequests")}</NavLink>
                </Col>
            </Row>
            {requestInfo.status === "NEW" &&
                <Container fluid>
                    {documentUpload && documentUpload.length > 0 &&
                    <Row className="rowSpace">
                        <Col>
                            <UploadComponent requiredDocuments={documentUpload}
                                             referenceNumber={requestInfo.referenceNumber} onUpload={onUpload}
                                             disableAdditionalDocuments={true}/>
                        </Col>
                    </Row>
                    }
                    <Row className="rowSpace justify-content-center">
                        <Restricted permission="REJECT_APPLICATION">
                            <Col md='auto'>
                                <Button variant="danger" onClick={() => setAction({ type: "REJECT" })}>{t("page.requestInspector.button.reject")}</Button>
                            </Col>
                        </Restricted>
                        <Restricted permission="APPROVE_APPLICATION">
                            <Col md='auto'>
                                <Button variant="success" onClick={() => { setAction({ type: 'APPROVE' }) }}>{t("page.requestInspector.button.approve")}</Button>
                            </Col>
                        </Restricted>
                    </Row>
                </Container>
            }
            {error &&
                <Row>
                    <Col>
                        <Alert>{error}</Alert>
                    </Col>
                </Row>
            }
            {requestDocument &&
                <Row>
                    <Col>
                        <DocumentViewComponent documentType={requestDocument.documentType} document={requestDocument.document} />
                    </Col>
                </Row>
            }
            {requestInfo.requiredDocuments && requestInfo.requiredDocuments.length > 0 && requiredDocuments &&
                <Container fluid>
                    <Row>
                        <Col><h3>{t("page.requestInspector.attachmentsTitle")}</h3></Col>
                    </Row>
                    {requiredDocuments.length === 0 &&
                        <Row>
                            <Col><Alert variant="info">{t("page.requestInspector.noAttachments")}</Alert></Col>
                        </Row>
                    }
                    {requiredDocuments.map((att) => {
                        return (
                            <Container fluid className="box rowSpace">
                                <Row className="rowSpace">
                                    {requestInfo.status === "NEW" &&
                                        <Restricted permission="DELETE_ATTACHMENT" >
                                            <Col md='auto'>
                                                <Button variant="outline-danger" onClick={() => { setAction({ type: "DELETE_ATTACHMENT", value: att.uuid }) }}>Törlés</Button>
                                            </Col>
                                        </Restricted>
                                    }
                                    <Col md='auto'>
                                        <h4>{att.name}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DocumentViewComponent documentType={att.type} document={att.value} />
                                    </Col>
                                </Row>
                            </Container>);
                    })}
                </Container>
            }
        </Container>
    )
}