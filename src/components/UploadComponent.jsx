import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'
import LoadingModal from './LoadingModal';
import AttachmentService from '../services/AttachmentService'
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import config from '../config';
import Restricted from './Restricted';

export default function UploadComponent({ referenceNumber, requiredDocuments, onUpload, onUploadSuccess, disableAdditionalDocuments }) {

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
    const [fileList, setFileList] = useState([]);

    useEffect(()=> {
        setFileList(getFileList())
    }, [requiredDocuments]);

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

    const validateFiles = () => {
        let tmp = [...fileList];
        for (let i in tmp) {
            if (tmp[i].file === null) {
                tmp[i].error = t("component.documentUpload.noSelectedFileError");
            } else if (tmp[i].file.size / 1024 > config.rest.uploadFileSizeLimit) {
                tmp[i].error = t("component.documentUpload.selectedFileSizeError", { sizeLimit: config.rest.uploadFileSizeLimit + " KB" });
            } else {
                tmp[i].error = null;
            }
        }
        return tmp;
    }

    const upload = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const validatedFiles = validateFiles();
        if (validatedFiles.every((f) => f.error === null) === true) {
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
                            if (onUpload)
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
                        if (onUploadSuccess) {
                            onUploadSuccess();
                        }
                        setFileList([{ id: uuid(), name: '', file: null }])
                    } else {
                        setFileList(errList);
                    }
                    setLoading(false);
                });
        } else {
            setFileList(validateFiles);
        }
    }

    return (
        <Container fluid className="box">
            <LoadingModal show={loading} />
            <Form noValidate onSubmit={upload}>
                {fileList.map((f) => (
                    <Container fluid>
                        <Row className="rowSpace">
                            <Col lg={f.required ? 6 : 5}>
                                <Form.File custom
                                    key={f.id} id={f.id}>
                                    <Form.File.Input isInvalid={!!f.error} onChange={onFileAdd} accept=".jpg, .jpeg, .pdf" />
                                    <Form.File.Label data-browse={t("component.documentUpload.browseFiles")}>
                                        {f.file ? f.file.name : t("component.documentUpload.noSelectedFile")}
                                    </Form.File.Label>
                                    <Form.Control.Feedback type="invalid">{f.error}</Form.Control.Feedback>
                                </Form.File>
                            </Col>
                            <Col lg={6}>
                                <Form.Control placeholder={t("component.documentUpload.documentNamePlaceholder")} key={f.id} id={f.id} value={f.name} onChange={onFileNameChange} disabled={f.required} />
                            </Col>
                            {!f.required &&
                                <Col lg={1}>
                                        <Button variant="danger" aria-label="Clear" onClick={() => { removeFile(f) }}>
                                            <span aria-hidden="false">&times;</span>
                                        </Button>
                                </Col>
                            }
                        </Row>
                    </Container>
                ))}
                <Restricted permission="UPLOAD_ATTACHMENT">
                    <Row className="rowSpace justify-content-center">
                        { disableAdditionalDocuments !== true && <Col xs="auto"><Button variant="outline-primary" onClick={addFile}>{t("component.documentUpload.addDocument")}</Button></Col> }
                        <Col xs="auto"><Button variant="outline-success" type="submit" disabled={referenceNumber === undefined}>{t("component.documentUpload.uploadDocument")}</Button></Col>
                    </Row>
                </Restricted>
            </Form>
        </Container>
    );
}