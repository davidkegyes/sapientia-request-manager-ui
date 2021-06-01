import React, { useState } from 'react';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import RequestServices from '../services/RequestService';

export default function MyRequestsPage(props) {

    let [myRequests, setMyRequests] = useState(undefined);

    if (myRequests === undefined) {
        RequestServices.getRequestList().then((res) => setMyRequests(res));
    }

    return (
        <Container>
            <h1>Requests</h1>
            { (myRequests === undefined || myRequests.lenght === 0) && <span>No requests found</span>}
            { myRequests && myRequests.map(request => {
                return (
                    <Row className='rowSpace'>
                        <Col>
                            <Card border="light">
                                <Card.Body>
                                    <Row>
                                        <Col xs={10} sm={8}>
                                            <Card.Title>{request.name}</Card.Title>
                                            <Card.Text>Ref: {request.referenceNumber}</Card.Text>
                                            <small className="text-muted">Created {request.createDateTime}</small>
                                        </Col>
                                        <Col xs={6} sm={2} className="d-flex align-items-center"><Badge variant="primary">Status</Badge></Col>
                                        <Col xs={6} sm={2} className='d-flex align-items-center'>
                                            <NavLink to={{
                                                pathname: "/inspect/" + encodeURIComponent(request.referenceNumber),
                                                props: { request: request }
                                            }} className='btn btn-outline-info ml-auto'>
                                                <span>View</span>
                                            </NavLink>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )
            })}
        </Container>
    );
}