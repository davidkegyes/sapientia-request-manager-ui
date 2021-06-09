import React, { useState } from 'react'
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap'
import LoadingModal from './LoadingModal';
import AttachmentService from '../services/AttachmentService'

export default function UploadComponent({ referenceNumber }) {

    const [loading, setLoading] = useState(false);
    const [fileId, setFileId] = useState(1);
    const [fileList, setFileList] = useState([{ id: 1, name: '', file: null }]);

    const removeFiles = () => {
        let newId = fileId + 1;
        setFileList([{ id: newId, name: '', file: null }]);
        setFileId(newId);
    }

    const removeFile = (file) => {
        if (fileList.length === 1) {
            let newId = fileId + 1;
            setFileList([{ id: newId, name: '', file: null }])
            setFileId(newId);
        } else {
            let tmp = fileList.filter((v) => v.id !== file.id);
            setFileList(tmp);
        }
    }

    const addFile = () => {
        let newId = fileId + 1;
        setFileList([...fileList, { id: newId, name: '', file: null }]);
        setFileId(newId);
    }

    const onFileAdd = (e) => {
        const { id, files } = e.target;
        changeFileList(id, 'file', files[0])
    }

    const onFileNameChange = (e) => {
        const { id, value } = e.target;
        changeFileList(id, 'name', value)
    }

    const changeFileList = (id, prop, value) => {
        let tmp = [...fileList];
        for (let i = 0; i <= tmp.length; i++) {
            if (tmp[i].id === parseInt(id)) {
                tmp[i][prop] = value;
                break;
            }
        }
        setFileList(tmp);
    }

    const upload = async () => {
        setLoading(true);
        let promises = [];
        for (let i in fileList) {
            if (fileList[i].success) {
                continue
            }
            promises.push(AttachmentService.uploadAttachment(referenceNumber, fileList[i].name, fileList[i].file))
        }
        Promise.allSettled(promises)
            .then((res) => {
                let errList = [];
                for (let i in fileList) {
                    if (res[i].status === 'fulfilled') {
                        continue;
                    }
                    let msg = res[i].reason.message;
                    try {
                        msg = res[i].reason.response.data.message;
                    } catch {}
                    errList.push({ ...fileList[i], error: msg });
                }
                if (errList.length === 0) {
                    removeFiles();
                } else {
                    setFileList(errList);
                }
                setLoading(false);
            });
    }
    return (
        <Container fluid className="box">
            <LoadingModal show={loading} />
            <Form>
                {fileList.map((f) => (
                    <>
                        {f.error &&
                            <Row>
                                <Col>
                                    <Alert variant="danger">{f.error}</Alert>
                                </Col>
                            </Row>
                        }
                        <Row className="rowSpace">
                            <Col lg={5}>
                                <Form.File key={f.id} id={f.id} onChange={onFileAdd} accept=".jpg, .jpeg, .pdf" />
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder="Dokumentum neve" type="text" key={f.id} id={f.id} value={f.name} onChange={onFileNameChange} />
                            </Col>
                            <Col lg={1}>
                                <Button variant="danger" aria-label="Clear" onClick={() => { removeFile(f) }}>
                                    <span aria-hidden="false">&times;</span>
                                </Button>
                            </Col>
                        </Row>
                    </>
                ))}
            </Form>

            <Row className="rowSpace justify-content-center">
                <Col xs="auto"><Button variant="outline-primary" onClick={addFile}>Hozzáadás</Button></Col>
                <Col xs="auto"><Button variant="outline-success" onClick={upload} disabled={referenceNumber === undefined}>Feltöltés</Button></Col>
            </Row>
        </Container>
    );
}