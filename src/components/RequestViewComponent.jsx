import React from 'react'
import { Container, Row, Col, Badge } from 'react-bootstrap';
import DocumentViewComponent from '../components/DocumentViewComponent';
import LoadingComponent from './LoadingComponent'
import RequestService from '../services/RequestService'
import { useAsyncRequest } from '../services/hooks'

export default function RequestViewComponent({ referenceNumber, test }) {

    const { data, isLoading } = useAsyncRequest(RequestService.getRequestByRef, referenceNumber);

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
                    <h3>{test}</h3>
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