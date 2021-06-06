import React from "react";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";

export default function UploadComponent({ doc, onChange }) {

    const document = doc;

    function changeDocumentValue(e) {
        const { files } = e.target;
        const tmp = { ...document };
        tmp.value = files[0];
        if (onChange) {
            onChange(tmp);
        }
    }

    return (
        <Container fluid className="rowSpace">
            {doc.errors && doc.errors.map((error, index) => (
                <Row key={error} className="rowSpace">
                    <Col>
                        <Alert key={error + '-' + index} variant='danger'>{error}</Alert>
                    </Col>
                </Row>
            ))}
            {!doc.uploadSuccess &&
                <Row key={doc.name} className="box d-flex justify-content-center">
                    <Col className>
                        <label>{doc.name}</label><br></br>
                        <small>Accepted format:{doc.accept}</small>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <i className="fas fa-upload"></i>{" "}
                        {doc.uploadSuccess && <Badge pill variant="success">Success</Badge>}
                        {!doc.uploadSuccess && <input name={doc.name} type="file" accept={doc.accept.toString()} multiple={false} onChange={changeDocumentValue}></input>}
                    </Col>
                </Row>
            }
        </Container>
    );
}