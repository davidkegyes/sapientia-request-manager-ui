import React, { useState } from 'react';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import RequestServices from '../services/RequestService';

export default function MyRequestsPage(props) {

    let [myRequests, setMyRequests] = useState(undefined);
    const {t} = useTranslation();

    if (myRequests === undefined) {
        RequestServices.getrequestInfoList().then((res) => setMyRequests(res));
    }

    return (
        <Container>
            <h1>{t("page.myRequests.title")}</h1>
            { (myRequests === undefined || myRequests.lenght === 0) && <span>{t("page.myRequests.noRequestFound")}</span>}
            { myRequests && myRequests.map(request => {
                return (
                    <Row className='rowSpace'>
                        <Col>
                            <Card className="box">
                                <Card.Body>
                                    <Row>
                                        <Col xs={10} sm={8}>
                                            <Card.Title>{request.name}</Card.Title>
                                            <Card.Text>{t("request.officialReferenceNumber")}: {request.officialReferenceNumber}</Card.Text>
                                            <Card.Text>{t("request.referenceNumber")}: {request.referenceNumber}</Card.Text>
                                            <Card.Text>{t("request.referenceNumber")}: {request.referenceNumber}</Card.Text>
                                            <small className="text-muted">{t("request.creationDate", {date: new Date(request.createDateTime)})}</small><br></br>
                                            <small className="text-muted">{t("request.lastUpdate", {date: new Date()})}</small>
                                        </Col>
                                        <Col xs={6} sm={2} className="d-flex align-items-center">
                                            <h5>
                                                {request.status === 'NEW' && <Badge variant="primary">{t("request.status.new")}</Badge>}
                                                {request.status === 'REJECTED' && <Badge variant="danger">{t("request.status.rejected")}</Badge>}
                                                {request.status === 'APPROVED' && <Badge variant="success">{t("request.status.approved")}</Badge>}
                                            </h5>
                                        </Col>
                                        <Col xs={6} sm={2} className='d-flex align-items-center'>
                                            <NavLink to={{
                                                pathname: "/inspect/" + encodeURIComponent(request.referenceNumber),
                                                props: { request: request }
                                            }} className='btn btn-outline-info ml-auto'>
                                                <span>{t("page.myRequests.openRequest")}</span>
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