import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import RequestService from '../services/RequestService'
import DocumentViewComponent from '../components/DocumentViewComponent';

export default function RequestInspectorPage() {

    const params = useParams();
    const [request, setRequest] = useState(undefined);
    const [attachments, setAttachments] = useState(undefined);

    const location = useLocation();

    if (request === undefined && location.props) {
        setRequest(location.props.request);
    }

    if (request === undefined && params.ref !== undefined) {
        RequestService.getRequestByRef(params.ref).then(res => setRequest(res));
    }

    if (request && attachments === undefined) {
        RequestService.getRequestAttachmentList(request.referenceNumber).then(res => setAttachments(res));
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Request Inspector page</h1>
                </Col>
                <Col className='d-flex align-items-center'>
                    <NavLink to="/myRequests" className='btn btn-outline-info ml-auto'>Back To MyRequests</NavLink>
                </Col>
            </Row>
            {request === undefined &&
                <Alert variant="danger">
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                        Please select a different request to inspect.
                    </p>
                </Alert>
            }
            { request &&
                <>
                    <Row className='rowSpace justify-content-center'>
                        <Col md='auto'>
                            <Button variant="outline-danger">Reject</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="outline-warning">Additional Approve Required</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="outline-success">Approve</Button>
                        </Col>
                    </Row>
                    <Row className="rowSapce">
                        <Col>
                            <Card>
                                <Card.Header>{request.name}</Card.Header>
                                <Card.Body>
                                    <DocumentViewComponent documentType={request.documentType} document={request.document} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {attachments && <>
                        {attachments.map(att =>
                            <Row className="rowSapce">
                                <Col>
                                    <Card>
                                        <Card.Header>
                                            {att.name}
                                        </Card.Header>
                                        <Card.Body>
                                            <DocumentViewComponent documentType={att.type} document={att.attachment} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </>}
                </>
            }

        </Container>
    )
}