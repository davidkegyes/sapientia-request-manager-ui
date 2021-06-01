import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

export default function DocumentViewerComponenet(props) {

    if (props.documentType === 'application/pdf') {
        return (
            <Container fluid>
                <Row className="justify-content-center">
                    <Document file={"data:application/pdf;base64," + props.document.toString('base64')}>
                        <Page renderMode='svg' renderTextLayer={false} pageNumber={1} />
                    </Document>
                </Row>
            </Container >
        );
    }

    if (props.documentType.startsWith('image')) {
        return (<Container fluid>
            <Row className="justify-content-center">
                <Col>
                    <Image src={"data:" + props.documentType + ";base64," + props.document.toString('base64')} />
                </Col>
            </Row>
        </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <h3>Can not show document type: '{props.documentType}'</h3>
            </Row>
        </Container>
    );

}