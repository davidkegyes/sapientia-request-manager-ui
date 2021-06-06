import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import RequestViewComponent from '../components/RequestViewComponent'
import RequestAttachmentListViewComponent from '../components/RequestAttachmentListViewComponent'
// import RequestService from '../services/RequestService'
// import DocumentViewComponent from '../components/DocumentViewComponent';
// import {useAsyncRequest} from '../services/hooks'

export default function RequestInspectorPage() {

    const params = useParams();
    const [request, setRequest] = useState(undefined);
    const [attachments, setAttachments] = useState(undefined);

    const location = useLocation();

    return (
        <Container>
            <Row style={{margin:'1rem'}}>
                <Col className='d-flex align-items-center'>
                    <NavLink to="/myRequests" className='btn btn-outline-info ml-auto'>Vissza a kérvényeimhez</NavLink>
                </Col>
            </Row>
            <Row>
                <RequestViewComponent referenceNumber={params.ref} />
                <RequestAttachmentListViewComponent referenceNumber={params.ref} />
            </Row>
        </Container>
    )
}