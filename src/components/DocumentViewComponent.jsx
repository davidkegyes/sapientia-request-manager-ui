import React from 'react'
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { Document, Page } from 'react-pdf';
import './DocumentViewComponent.css'
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewerComponenet({ documentType, document }) {

    return (
        <Container fluid>
            <Row className="rowSpace">
                {document &&
                    <Col className="d-flex justify-content-center">
                        {documentType.startsWith('image') && <Image fluid src={"data:" + documentType + ";base64," + document.toString('base64')} />}
                        {documentType === 'application/pdf' &&
                            <Document className="box" loading={<Spinner animation="border" variant="success" />} file={"data:application/pdf;base64," + document.toString('base64')}>
                                <Page renderMode='svg' renderTextLayer={false} pageNumber={1} />
                            </Document>
                        }
                    </Col>
                }
            </Row>
        </Container>
    );

}