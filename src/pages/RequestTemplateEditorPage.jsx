import React, {useEffect, useState} from 'react'
import {NavLink, Redirect} from 'react-router-dom';
import {Button, Col, Container, Form, Row} from 'react-bootstrap'
import {useParams} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {useTranslation} from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import LoadingModal from '../components/LoadingModal';
export default function RequestTemplateEditorPage() {

    const {t} = useTranslation();

    const params = useParams();

    const customText = {
        "id": null,
        "hint": "",
        "wrapper": "body3",
        "style": "body text customText",
        "type": "customText",
        "name": "customText",
        "component": "body"
    }

    const text = {
        "id": uuid(),
        "text": "",
        "wrapper": "body1",
        "style": "body text ",
        "type": "text",
        "component": "body",
        "variables": []
    }

    const variable = {
        "id": null,
        "name": "",
        "type": "text",
        "hint": "",
        "min": null,
        "max": null
    }

    const empty = [
        {
            "id": uuid(),
            "wrapper": "title",
            "text": "",
            "type": "title",
            "component": "title"
        },
        {
            "id": uuid(),
            "wrapper": "body1",
            "style": "body text ",
            "text": "",
            "type": "text",
            "component": "body",
            "variables": []
        },
        {
            "id": uuid(),
            "wrapper": "body3",
            "style": "body text customText",
            "type": "customText",
            "name": "customText",
            "hint": "",
            "component": "body"
        },
        {
            "id": uuid(),
            "wrapper": "dateAndSignature",
            "style": "signature",
            "signatureText": "",
            "dateText": "",
            "type": "dateAndSignature",
            "component": "dateAndSignature"
        }
    ];

    const emptyInfo = {name: '', description: '', language: ''};

    const [templateInfo, setTemplateInfo] = useState(emptyInfo)
    const [form, setForm] = useState(empty);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [goToTemplates, setGoToTemplates] = useState(false);

    const addIdIfMisingToForm = (list) => {
        for (let i in list) {
            if (list[i].id === undefined || list[i].id === null || list[i].id === '') {
                list[i].id = uuid();
            }
            if (list[i].component === undefined || list[i].component === null || list[i].component === '') {
                if (list[i].wrapper === 'title' || list[i].wrapper === 'dateAndSignature') {
                    list[i].component = list[i].wrapper;
                } else if (list[i].wrapper.startsWith("body")) {
                    list[i].component = "body";

                }
            }
            if (list[i].variables) {
                for (let j in list[i].variables) {
                    if (list[i].variables[j].id === undefined || list[i].variables[j].id === null || list[i].variables[j].id === '') {
                        list[i].variables[j].id = uuid();
                    }
                }
            }
        }
        return list;
    }

    const prepRequiredDocuments = (docs) => {
        let dl = [];
        if (docs) {
            for (let i in docs) {
                dl.push({id: uuid(), name: docs[i]});
            }
        }
        return dl;
    }


    const getTemplate = async (tuuId) => {
        setLoading(true);
        try {
            const rt = await RequestTemplateService.getTemplateByUuid(tuuId);
            setTemplateInfo({name: rt.name, description: rt.description, language: rt.language});
            setForm(addIdIfMisingToForm(rt.form));
            setRequiredDocuments(prepRequiredDocuments(rt.requiredDocuments));
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (params.uuid !== undefined && params.uuid !== null && params.uuid !== '') {
            getTemplate(params.uuid);
        }
    }, [params.ref]);

    const constructVariableList = (text, variables) => {
        let variableNames = text.match(/({\w+})/g);
        let newVariables = [];
        if (variableNames !== null) {
            newVariables = variables.filter(v => variableNames.includes("{" + v.name + "}"))
            let index = 0;
            if (newVariables.length !== variableNames.length) {
                for (let i in newVariables) {
                    if (variableNames[i] === "{" + newVariables[i].name + "}") {
                        index++;
                    } else {
                        break;
                    }
                }
                let newVar = {...variable};
                newVar.id = uuid();
                newVar.name = variableNames[index].slice(1, -1);
                newVariables.splice(index, 0, newVar);
            }
        }
        return newVariables;
    }

    const onFormChange = (event) => {
        const {id, value} = event.target;
        const {targetfield, partid} = event.target.dataset;
        console.log(id);
        let tmp = [...form];
        let variableId = partid === undefined ? undefined : id;
        let formPartId = partid === undefined ? id : partid;
        for (let i in tmp) {
            if (tmp[i].id === formPartId) {
                if (variableId !== undefined) {
                    for (let j in tmp[i].variables) {
                        if (variableId === tmp[i].variables[j].id) {
                            tmp[i].variables[j][targetfield] = value;
                            break;
                        }
                    }
                } else {
                    if (targetfield === undefined) {
                        tmp[i].text = value;
                        if (tmp[i].component === 'body' && tmp[i].type === 'text') {
                            tmp[i].variables = constructVariableList(value, tmp[i].variables);
                        }
                    } else {
                        tmp[i][targetfield] = value;
                    }
                    break;
                }
            }
        }
        setForm(tmp);
    }

    const onAttachmentChangeList = (event) => {
        const {id, value} = event.target;
        let tmp = [...requiredDocuments];
        for (let i in tmp) {
            if (tmp[i].id === id) {
                tmp[i].name = value;
                break;
            }
        }
        setRequiredDocuments(tmp);
    }

    const addNewAttachment = () => {
        if (requiredDocuments.length < 6) {
            setRequiredDocuments([...requiredDocuments, {id: uuid(), name: ''}]);
        }
    }

    const deleteAttachment = (id) => {
        setRequiredDocuments(requiredDocuments.filter(i => i.id !== id));
    }

    const removeFormPart = (id) => {
        setForm(form.filter(f => f.id !== id));
    }

    const addFormPart = (part) => {
        let tmp = [...form];
        let ct = {...part};
        ct.id = uuid();
        ct.wrapper = ct.id;
        tmp.splice(tmp.length - 1, 0, ct);
        setForm(tmp);
    }

    const onTemplateInfoChange = (event) => {
        const {id, value} = event.target;
        let tmp = {...templateInfo};
        tmp[id] = value;
        setTemplateInfo(tmp);
    }

    const validate = () => {
        let valid = true;
        let vtInfo = {...templateInfo};
        if (vtInfo.name === undefined || vtInfo.name === null || vtInfo.name === '') {
            vtInfo.nameError = "Ez kell";
            valid = false;
        } else {
            delete vtInfo.nameError;
        }
        if (vtInfo.description === undefined || vtInfo.description === null || vtInfo.description === '') {
            vtInfo.descriptionError = "Ez kell";
            valid = false;
        } else {
            delete vtInfo.descriptionError;
        }
        let vForm = [...form];
        for (let i in vForm) {
            if (vForm[i].type === 'dateAndSignature') {
                if (vForm[i].signatureText === null || vForm[i].signatureText === undefined || vForm[i].signatureText === '') {
                    vForm[i].signatureTextError = 'Ez is kell te....';
                    valid = false;
                } else {
                    delete vForm[i].signatureTextError;
                }
                if (vForm[i].dateText === null || vForm[i].dateText === undefined || vForm[i].dateText === '') {
                    vForm[i].dateTextError = 'Ez is kell te....';
                    valid = false;
                } else {
                    delete vForm[i].dateTextError;
                }
            } else if (vForm[i].type === 'customText') {
                if (vForm[i].hint === null || vForm[i].hint === undefined || vForm[i].hint === '') {
                    vForm[i].error = 'Ez is kell te....';
                    valid = false;
                } else {
                    delete vForm[i].error;
                }
            } else {
                if (vForm[i].text === null || vForm[i].text === undefined || vForm[i].text === '') {
                    vForm[i].error = 'Ez is kell te....';
                    valid = false;
                } else {
                    delete vForm[i].error;
                }
                if (vForm[i].variables) {
                    for (let j in vForm[i].variables) {
                        if (vForm[i].variables[j].hint === null || vForm[i].variables[j].hint === undefined || vForm[i].variables[j].hint === '') {
                            vForm[i].variables[j].hintError = "Ez is kell";
                            valid = false;
                        } else {
                            delete vForm[i].variables[j].hintError;
                        }
                        if (vForm[i].variables[j].type === 'number') {
                            if (vForm[i].variables[j].min === null || vForm[i].variables[j].min === undefined || vForm[i].variables[j].min === '') {
                                vForm[i].variables[j].minError = "Ez is kell";
                                valid = false;
                            } else {
                                delete vForm[i].variables[j].minError;
                            }
                            if (vForm[i].variables[j].max === null || vForm[i].variables[j].max === undefined || vForm[i].variables[j].max === '') {
                                vForm[i].variables[j].maxError = "Ez is kell";
                                valid = false;
                            } else {
                                delete vForm[i].variables[j].maxError;
                            }
                        }
                    }
                    console.log(vForm[i].variables);
                }
            }
        }
        return {valid, vtInfo, vForm}
    }


    const saveTemplate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const {valid, vtInfo, vForm} = validate();
        if (valid === false) {
            setTemplateInfo(vtInfo);
            setForm(vForm);
        } else {
            const template = {
                uuid: params.uuid,
                name: templateInfo.name,
                description: templateInfo.description,
                language: '',
                requiredDocuments: requiredDocuments.map((doc) => doc.name),
                form: form
            }
            setLoading(true);
            RequestTemplateService.saveTemplate(template)
                .then((res) => {
                    setLoading(false);
                    setGoToTemplates(true);
                }).catch((err) => {
                setLoading(false);
            });
        }
    }

    if (goToTemplates) {
        return (<Redirect to={
            {
                pathname: '/',
                state: {
                    from: ''
                }
            }
        } />)
    }

    return (
        <Container>
            <LoadingModal show={loading}/>
            <Form>
                <Container fluid className="noPadding">
                    <Row className="align-items-center">
                        <Col>
                            <h1>Editor</h1>
                        </Col>
                        <Col>
                            <Button variant="success" type={"submit"}
                                    onClick={saveTemplate}>{t("page.requesTemplateEditor.templateButton2")}</Button>
                        </Col>
                        <Col xs="auto">
                            <NavLink to="/"><Button variant="outline-info">Back</Button></NavLink>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="box rowSpace">
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            {t("page.requesTemplateEditor.templateName")}
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control isInvalid={!!templateInfo.nameError} required type="text"
                                          placeholder={t("page.requesTemplateEditor.templateEG")}
                                          value={templateInfo.name} id="name" onChange={onTemplateInfoChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            {t("page.requesTemplateEditor.templateDescription")}
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control isInvalid={!!templateInfo.descriptionError} required type="text"
                                          placeholder={t("page.requesTemplateEditor.templateGeneral")}
                                          value={templateInfo.description} id="description"
                                          onChange={onTemplateInfoChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} className="rowSpace">
                            {t("page.requesTemplateEditor.attachmentList")}
                        </Form.Label>
                        <Col sm={10}>
                            {requiredDocuments.map((doc) => {
                                return (
                                    <Row key={doc.id} className="rowSpace">
                                        <Col sm={11}>
                                            <Form.Control id={doc.id} onChange={onAttachmentChangeList} required
                                                          type="text" placeholder="Kert csatolmany neve"
                                                          value={doc.name}/>
                                        </Col>
                                        <Col sm={1}>
                                            <Button variant="outline-danger" onClick={() => {
                                                deleteAttachment(doc.id)
                                            }}><i className="fas fa-minus"></i></Button>
                                        </Col>
                                    </Row>
                                )
                            })
                            }
                            <Row className="rowSpace">
                                <Col>
                                    <Button variant="outline-info" onClick={addNewAttachment}><i
                                        className="fas fa-plus"></i></Button>
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                </Container>
                <Container fluid className="box rowSpace">
                    {form.map((part) => {
                        if (part.type === "title") {
                            return (
                                <Row className="justify-content-md-center rowSpace">
                                    <Col xs lg={4}>
                                        <Form.Group>
                                            <Form.Control isInvalid={!!part.error} required id={part.id} type="text"
                                                          placeholder={t("page.requesTemplateEditor.officialAddress")}
                                                          style={{'textAlign': 'center'}}
                                                          value={part.text} onChange={onFormChange}/>
                                            <Form.Control.Feedback type="invalid">{part.error}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        } else if (part.type === "text") {
                            return (
                                <Container fluid className="rowSpace">
                                    <Row>
                                        <Col md="auto">
                                            <Button variant="outline-danger" onClick={() => {
                                                removeFormPart(part.id)
                                            }}><i className="fas fa-minus"></i></Button>
                                        </Col>
                                        <Col>
                                            <h3>{t("page.requesTemplateEditor.templateSablon")}</h3>
                                        </Col>
                                    </Row>
                                    <Row className="rowSpace">
                                        <Col>
                                            <Form.Group>
                                                <Form.Control isInvalid={!!part.error} required id={part.id}
                                                              as="textarea"
                                                              style={{textIndent: '2rem'}} rows={3} value={part.text}
                                                              onChange={onFormChange}/>
                                                <Form.Control.Feedback
                                                    type="invalid">{part.error}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="rowSpace">
                                        {!!part.variables && part.variables.map((v) => {
                                            return (<Col xs lg={4} className="box">
                                                <Form.Group>
                                                    <Form.Label>{t("page.requesTemplateEditor.templateVariable")}</Form.Label>
                                                    <Form.Control type="text" value={v.name} disabled/>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Utalás</Form.Label>
                                                    <Form.Control isInvalid={!!v.hintError} required id={v.id}
                                                                  data-partid={part.id} data-targetfield="hint"
                                                                  type="text" value={v.hint} onChange={onFormChange}/>
                                                    <Form.Control.Feedback
                                                        type="invalid">{v.hintError}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Típus</Form.Label>
                                                    <Form.Control required id={v.id} data-partid={part.id}
                                                                  data-targetfield="type" as="select"
                                                                  onChange={onFormChange} value={v.type}>
                                                        <option value='text'>Szoveg</option>
                                                        <option value='number'>Szam</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                {v.type === 'number' &&
                                                <Form.Row>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>Min</Form.Label>
                                                        <Form.Control isInvalid={!!v.minError} required id={v.id}
                                                                      data-partid={part.id} data-targetfield="min"
                                                                      type="number" value={v.min}
                                                                      onChange={onFormChange}/>
                                                        <Form.Control.Feedback
                                                            type="invalid">{v.minError}</Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>Max</Form.Label>
                                                        <Form.Control isInvalid={!!v.maxError} required id={v.id}
                                                                      data-partid={part.id} data-targetfield="max"
                                                                      type="number" value={v.max}
                                                                      onChange={onFormChange}/>
                                                        <Form.Control.Feedback
                                                            type="invalid">{v.maxError}</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Form.Row>}
                                            </Col>)
                                        })}
                                    </Row>
                                </Container>)
                        } else if (part.type === 'customText') {
                            return (
                                <Container fluid className="rowSpace">
                                    <Row>
                                        <Col md="auto">
                                            <Button variant="outline-danger" onClick={() => {
                                                removeFormPart(part.id)
                                            }}><i className="fas fa-minus"></i></Button>
                                        </Col>
                                        <Col>
                                            <h3>{t("page.requesTemplateEditor.templateCustomText")}</h3>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm={2}>
                                                    {t("page.requesTemplateEditor.templateReference")}
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control isInvalid={part.error} required type="text"
                                                                  id={part.id} data-targetfield="hint" value={part.hint}
                                                                  onChange={onFormChange}/>
                                                    <Form.Control.Feedback
                                                        type="invalid">{part.error}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Control id={part.id} as="textarea" rows={2} disabled
                                                          value={t("page.requesTemplateEditor.templatecomment")}/>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                        }
                        if (part.component === "dateAndSignature") {
                            return (
                                <Container fluid className="rowSpace">
                                    <Row className="justify-content-md-center">
                                        <Col md="auto">
                                            <Button variant="outline-info" onClick={() => {
                                                addFormPart(text)
                                            }}><i
                                                className="fas fa-plus"></i> {t("page.requesTemplateEditor.templateTemplateText")}
                                            </Button>
                                        </Col>
                                        <Col md="auto">
                                            <Button variant="outline-info" onClick={() => {
                                                addFormPart(customText)
                                            }}> <i
                                                className="fas fa-plus"></i> {t("page.requesTemplateEditor.templateTemplateOneText")}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className="rowSpace">
                                        <Col>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5}>
                                                    <Form.Group>
                                                        <Form.Control isInvalid={part.dateTextError} id={part.id}
                                                                      data-targetfield="dateText" value={part.dateText}
                                                                      required type="text"
                                                                      placeholder={t("page.requesTemplateEditor.templateDate")}
                                                                      style={{'textAlign': 'center'}}
                                                                      onChange={onFormChange}/>
                                                        <Form.Control.Feedback
                                                            type="invalid">{t("page.requesTemplateEditor.templateTemplateObligatory")}</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5} className="text-center"
                                                     style={{'fontSize': '3rem', 'color': 'blue'}}>
                                                    <i className="far fa-calendar-alt"></i>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5}>
                                                    <Form.Group>
                                                        <Form.Control isInvalid={part.signatureTextError} id={part.id}
                                                                      data-targetfield="signatureText" required
                                                                      value={part.signatureText} type="text"
                                                                      placeholder={t("page.requesTemplateEditor.templateSignature")}
                                                                      style={{'textAlign': 'center'}}
                                                                      onChange={onFormChange}/>
                                                        <Form.Control.Feedback
                                                            type="invalid">{t("page.requesTemplateEditor.templateSignature")}</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5} className="text-center"
                                                     style={{'fontSize': '3rem', 'color': 'blue'}}>
                                                    <i className="fas fa-signature"></i>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                        }
                        return "";
                    })}
                </Container>
            </Form>
        </Container>
    )

}