import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal'
import RequestService from '../services/RequestService'
import DocumentViewComponent from '../components/DocumentViewComponent';
import AttachmentService from '../services/AttachmentService';
import UploadComponent from '../components/UploadComponent';
import { useTranslation } from 'react-i18next';
import Restricted from '../components/Restricted';
import { saveAs } from 'file-saver';
import { UserContext } from "../App";

const splitRequestObject = (request) => {
    let info = { ...request };
    delete info.document;
    delete info.documentType;
    let doc = { documentType: request.documentType, document: request.document }
    return { info, doc };
}

export default function RequestInspectorPage() {

    const params = useParams();

    let history = useHistory();
    const userContext = useContext(UserContext);
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
        if (requiredDocuments === null || requiredDocuments === undefined || requiredDocuments.length === 0) {
            setAction({type : "INIT"});
        }
        setLoading(false);
    })

    useEffect(() => {
        if (requiredDocuments != null && requestInfo.requiredDocuments != null) {
            const uploadList = [];
            const uploaded = requiredDocuments.map(rd => rd.name);
            for (const d in requestInfo.requiredDocuments) {
                if (!uploaded.includes(requestInfo.requiredDocuments[d])) {
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
                        setRequestInfo(await RequestService.approve(params.ref));
                        break;
                    case "REJECT":
                        setRequestInfo(await RequestService.reject(params.ref));
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
        saveAs(blob, `${requestInfo.name}.${requestDocument.documentType.startsWith('image') ? 'jpg' : 'pdf'}`)
    }

    return (
        <Container fluid className="noPadding">
            <LoadingModal show={loading} />

            <Row className='align-items-center noPadding'>
                <Col>
                    <h2>{requestInfo.name}</h2>
                </Col>
                <Col md="auto">
                    <h3>
                        {requestInfo.status === 'NEW' && <Badge variant="primary">{t("request.status.new")}</Badge>}
                        {requestInfo.status === 'REJECTED' && <Badge variant="danger">{t("request.status.rejected")}</Badge>}
                        {requestInfo.status === 'INCOMPLETE' && <Badge variant="warning">{t("request.status.incomplete")}</Badge>}
                        {requestInfo.status === 'APPROVED' && <Badge variant="success">{t("request.status.approved")}</Badge>}
                    </h3>
                </Col>
                <Col md="auto">
                    <Button variant='outline-primary' onClick={downloadRequest}>Download</Button>
                </Col>
                <Col md="auto" className='d-flex align-items-center'>
                    <Button variant="outline-info" onClick={() => { console.log(history); history.goBack(); }}>Go Back</Button>
                </Col>
            </Row>
            {userContext.user.email !== requestInfo.user.email &&
                <Container fluid className="box">
                    <Row>
                        <Col md={2}>
                            {t('request.uploadedBy')}
                        </Col>
                        <Col>
                            {requestInfo.user.firstname + " " + requestInfo.user.lastname}
                        </Col>
                        <Col md="auto">
                            <a href={"mailto:" + requestInfo.user.email} >{requestInfo.user.email}</a>
                        </Col>
                    </Row>
                </Container>
            }
            <Container fluid className="rowSpace noPadding">
                {requestInfo.status === "INCOMPLETE" &&
                    documentUpload && documentUpload.length > 0 &&
                    <>
                        <Row>
                            <Col>
                                <Alert variant="warning">{t('request.incomplete')}</Alert>
                            </Col>
                        </Row>
                        <Row >
                            <Col>
                                <UploadComponent requiredDocuments={documentUpload}
                                    referenceNumber={requestInfo.referenceNumber} onUpload={onUpload}
                                    disableAdditionalDocuments={true} />
                            </Col>
                        </Row>
                    </>
                }
                {(userContext.user.role.name === 'ADMIN' || requestInfo.status === "NEW" && userContext.user.email !== requestInfo.user.email) &&
                    <Row className="rowSpace justify-content-center">
                        <Restricted permission="REJECT_APPLICATION">
                            <Col md='auto'>
                                <Button variant="danger"
                                    onClick={() => setAction({ type: "REJECT" })}>{t("page.requestInspector.button.reject")}</Button>
                            </Col>
                        </Restricted>
                        <Restricted permission="APPROVE_APPLICATION">
                            <Col md='auto'>
                                <Button variant="success" onClick={() => {
                                    setAction({ type: 'APPROVE' })
                                }}>{t("page.requestInspector.button.approve")}</Button>
                            </Col>
                        </Restricted>
                    </Row>
                }
            </Container>
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
                        <DocumentViewComponent className="box" documentType={requestDocument.documentType} document={requestDocument.document} />
                    </Col>
                </Row>
            }
            {requestInfo.requiredDocuments && requestInfo.requiredDocuments.length > 0 && requiredDocuments &&
                <Container fluid className="noPadding">
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
                            <Container fluid className="rowSpace">
                                <Row className="rowSpace">
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