import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal'
import RequestService from '../services/RequestService'
import DocumentViewComponent from '../components/DocumentViewComponent';
import RestTemplate from '../services/RestTemplate';
import config from '../config'
import AttachmentService from '../services/AttachmentService';
import UploadComponent from '../components/UploadComponenet';

const splitRequestObject = (request) => {
    let requestInfo = { ...request };
    delete requestInfo.document;
    delete requestInfo.documentType;
    let requestDocument = { documentType: request.documentType, document: request.document }
    return { requestInfo, requestDocument };
}

export default function RequestInspectorPage() {

    const params = useParams();

    // const { data, callError, isLoading } = useAsyncRequest(RequestService.getRequestByRef, params.ref);
    // const [request, setRequest] = useState(data);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requestInfo, setRequestInfo] = useState(null);
    const [requestDocument, setRequestDocument] = useState(null);
    const [attachmentList, setAttachMentList] = useState(null);
    const [action, setAction] = useState({ type: "INIT" });


    useEffect(() => {
        async function doAction() {
            console.log("In use effect");
            setLoading(true);
            try {
                switch (action.type) {
                    case "INIT":
                        const request = await RequestService.getRequestByRef(params.ref);
                        const { requestInfo, requestDocument } = splitRequestObject(request);
                        setRequestInfo(requestInfo);
                        setRequestDocument(requestDocument);
                        setAttachMentList(await AttachmentService.getListForRequestReferenceNumber(params.ref));
                        break;
                    case "APPROVE":
                        await RequestService.approve(params.ref);
                        break;
                    case "REJECT":
                        await RequestService.reject(params.ref);
                        break;
                    case "DELETE_ATTACHMENT":
                        await AttachmentService.delete(action.value);
                        setAttachMentList(attachmentList.filter((o) => o.uuid !== action.value))
                        break;
                    case "RELOAD_ATTACHMENTS":
                        break;
                    default:
                        setLoading(false);
                        break;
                }
                if (action !== "INIT")
                    RestTemplate.get(config.rest.requestInfo + "/" + params.ref).then(res => setRequestInfo(res));
            } catch (error) {
                console.log(error);
                setError(error);
            }
            setLoading(false);
        }
        doAction();
    }, [action, params.ref])

    if (requestInfo === null) {
        return (<LoadingModal show={true} />);
    }

    return (
        <Container>
            <Row>
                <Col md="auto">
                    <h3>
                        {requestInfo.status === 'NEW' && <Badge variant="primary">{requestInfo.status}</Badge>}
                        {requestInfo.status === 'REJECTED' && <Badge variant="danger">{requestInfo.status}</Badge>}
                        {requestInfo.status === 'APPROVED' && <Badge variant="success">{requestInfo.status}</Badge>}
                        {requestInfo.status === 'MULTIPLE_APPROVE_REQUIRED' && <Badge requestInfo="warning">{requestInfo.status}</Badge>}
                    </h3>
                </Col>
                <Col md="auto">
                    <h2>{requestInfo.name}</h2>
                </Col>
                <Col className='d-flex align-items-center'>
                    <NavLink to="/myRequests" className='btn btn-outline-info ml-auto'>Vissza a kérvényeimhez</NavLink>
                </Col>
            </Row>
            <LoadingModal show={loading} />
            {requestInfo.status === "NEW" &&
                <>
                    <Row className="rowSpace">
                        <Col>
                            <UploadComponent referenceNumber={requestInfo.referenceNumber} />
                        </Col>
                    </Row>
                    <Row className="rowSpace justify-content-center">
                        <Col md='auto'>
                            <Button variant="danger" onClick={() => setAction({ type: "REJECT" })}>Elutasítás</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="warning" disabled>Tobblépcsős elfogadás</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="success" onClick={() => { setAction({ type: 'APPROVE' }) }}>Elfogadás</Button>
                        </Col>
                    </Row>
                </>
            }
            { error &&
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
            {attachmentList &&
                <>
                    <Row>
                        <Col><h3>Csatolmányok</h3></Col>
                    </Row>
                    {attachmentList.length === 0 &&
                        <Row>
                            <Col><Alert variant="info">Nincsenek Csatolmányok</Alert></Col>
                        </Row>
                    }
                    {attachmentList.map((att) => {
                        return (
                            <>
                                <Row>
                                    {requestInfo.status === "NEW" &&
                                        <Col md='auto'>
                                            <Button variant="outline-danger" onClick={() => { setAction({ type: "DELETE_ATTACHMENT", value: att.uuid }) }}>Törlés</Button>
                                        </Col>
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
                            </>);
                    })}
                </>
            }
        </Container>
    )
}