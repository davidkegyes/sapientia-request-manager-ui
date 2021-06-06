import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import DocumentViewComponent from './DocumentViewComponent';
import LoadingComponent from './LoadingComponent'
import AttachmentService from '../services/AttachmentService'
import { useAsyncRequest } from '../services/hooks'

export default function RequestAttachmentListViewComponent({ referenceNumber }) {

    const { data, error, isLoading } = useAsyncRequest(AttachmentService.getListForRequestReferenceNumber, referenceNumber);

    if (isLoading === true) {
        return <LoadingComponent text='Loading request Attachments' />
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    {data && data.map((d) => {
                        return (<DocumentViewComponent documentName={d.name} documentType={d.type} document={d.value} />);
                    })}
                </Col>
            </Row>
        </Container>
    )
}