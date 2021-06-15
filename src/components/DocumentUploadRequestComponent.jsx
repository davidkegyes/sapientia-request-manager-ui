import React, { useState } from 'react'
import LoadingModal from './LoadingModal';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap'
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';

export default function DocumentUploadRequestComponent ({ referenceNumber }) {

    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([{ id: uuid(), name: '' }]);

    const removeFile = (file) => {
        if (fileList.length === 1) {
            setFileList([{ id: uuid(), name: '' }]);
        } else {
            let tmp = fileList.filter((v) => v.id !== file.id);
            setFileList(tmp);
        }
    }

    const addFile = () => {
        setFileList([...fileList, { id: uuid(), name: '' }]);
    }

    const onFileNameChange = (e) => {
        const { id, value } = e.target;
        let tmp = [...fileList];
        for (let i = 0; i <= tmp.length; i++) {
            if (tmp[i].id === id) {
                tmp[i].name = value;
                break;
            }
        }
        setFileList(tmp);
    }

    const requestDocuments = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <Container fluid className="box">
            <LoadingModal show={loading} />
            <Form onSubmit={requestDocuments}>
                {fileList.map((f) => (
                    <Container fluid>
                        {f.error &&
                            <Row>
                                <Col>
                                    <Alert variant="danger">{f.error}</Alert>
                                </Col>
                            </Row>
                        }
                        <Row className="rowSpace">
                            <Col lg={1}>
                                <Button variant="danger" aria-label="Clear" onClick={() => { removeFile(f) }}>
                                    <span aria-hidden="false">&times;</span>
                                </Button>
                            </Col>
                            <Col lg={7}>
                                <Form.Control placeholder="Dokumentum neve" key={f.id} id={f.id} value={f.name} onChange={onFileNameChange} />
                            </Col>
                            <Col xs="auto"><Button variant="outline-primary" onClick={addFile}>{t("component.documentUploadRequest.addDocument")}</Button></Col>
                        </Row>
                    </Container>
                ))}
            </Form>
            <Row className="rowSpace justify-content-center">
                <Col xs="auto"><Button variant="outline-success" type="submit" disabled={referenceNumber === undefined}>{t("component.documentUploadRequest.requestDocument", {count: fileList.length})}</Button></Col>
            </Row>
        </Container>
    );

}