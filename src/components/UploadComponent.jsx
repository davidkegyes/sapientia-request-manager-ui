import React, { useState } from 'react'
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap'
import LoadingModal from './LoadingModal';
import AttachmentService from '../services/AttachmentService'
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';

export default function UploadComponent({ referenceNumber, onUpload, requiredDocuments }) {

    const getFileList = () => {
        if (requiredDocuments !== undefined && requiredDocuments !== undefined && requiredDocuments.length > 0) {
            let files = [];
            for (let i = 0; i < requiredDocuments.length; i++) {
                files.push({ id: uuid(), name: requiredDocuments[i], file: null, required: true });
            }
            return files;
        }
        return [{ id: uuid(), name: '', file: null }];
    }

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState(getFileList());
    const [validated, setValidated] = useState(false);

    const removeFile = (file) => {
        if (fileList.length === 1) {
            setFileList([{ id: uuid(), name: '', file: null }]);
        } else {
            let tmp = fileList.filter((v) => v.id !== file.id);
            setFileList(tmp);
        }
    }

    const addFile = () => {
        setFileList([...fileList, { id: uuid(), name: '', file: null }]);
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
            if (tmp[i].id === id) {
                tmp[i][prop] = value;
                break;
            }
        }
        setFileList(tmp);
    }

    const upload = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
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
                            onUpload(fileList[i])
                            continue;
                        }
                        let msg = res[i].reason.message;
                        try {
                            msg = res[i].reason.response.data.message;
                        } catch (any) { }
                        errList.push({ ...fileList[i], error: msg });
                    }
                    if (errList.length === 0) {
                        setFileList([{ id: uuid(), name: '', file: null }])
                    } else {
                        setFileList(errList);
                    }
                    setLoading(false);
                });
            setValidated(true);
        }
    }
    return (
        <Container fluid className="box">
            <LoadingModal show={loading} />
            <Form noValidate validated={validated} onSubmit={upload}>
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
                            <Col lg={5}>
                                <Form.File custom
                                    key={f.id} id={f.id}                         >
                                    <Form.File.Input required onChange={onFileAdd} accept=".jpg, .jpeg, .pdf" />
                                    <Form.File.Label data-browse={t("component.documentUpload.browseFiles")}>
                                        {f.file ? f.file.name : t("component.documentUpload.noSelectedFile")}
                                    </Form.File.Label>
                                    <Form.Control.Feedback type="invalid">{t("component.documentUpload.noSelectedFileError")}</Form.Control.Feedback>
                                </Form.File>
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder={t("component.documentUpload.documentNamePlaceholder")} key={f.id} id={f.id} value={f.name} onChange={onFileNameChange} disabled={f.required} />
                            </Col>
                            <Col lg={1}>
                                {!f.required &&
                                    <Button variant="danger" aria-label="Clear" onClick={() => { removeFile(f) }}>
                                        <span aria-hidden="false">&times;</span>
                                    </Button>
                                }
                            </Col>
                        </Row>
                    </Container>
                ))}

                <Row className="rowSpace justify-content-center">
                    <Col xs="auto"><Button variant="outline-primary" onClick={addFile}>{t("component.documentUpload.addDocument")}</Button></Col>
                    <Col xs="auto"><Button variant="outline-success" type="submit" disabled={referenceNumber === undefined}>{t("component.documentUpload.uploadDocument")}</Button></Col>
                </Row>
            </Form>
        </Container>
    );
}