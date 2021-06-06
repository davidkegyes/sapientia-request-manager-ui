import React from 'react'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import DocumentViewComponent from '../components/DocumentViewComponent';
import LoadingModal from './LoadingModal'
import LoadingComponent from './LoadingComponent'
import RequestService from '../services/RequestService'
import { useAsyncRequest } from '../services/hooks'

export default function RequestViewComponent({ referenceNumber }) {

    const { data, error, isLoading } = useAsyncRequest(RequestService.getRequestByRef, referenceNumber);

    if (isLoading === true || data === null) {
        return <LoadingComponent text='Loading request' />
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h3>{data.name}
                        {data.status === 'NEW' && <Badge variant="primary">{data.status}</Badge>}
                        {data.status === 'REJECTED' && <Badge variant="danger">{data.status}</Badge>}
                        {data.status === 'APPROVED' && <Badge variant="success">{data.status}</Badge>}
                        {data.status === 'MULTIPLE_APPROVE_REQUIRED' && <Badge variant="warning">{data.status}</Badge>}
                    </h3>
                </Col>
                <Col>
                    <Row>
                        <Col md='auto'>
                            <Button variant="outline-danger">Elutasítás</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="outline-warning">Tobblépcsős elfogadás</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant="outline-success">Elfogadás</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DocumentViewComponent documentName={data.name} documentType={data.documentType} document={data.document} />
                </Col>
            </Row>
        </Container>
    )
}