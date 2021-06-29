import React, { useState, useEffect } from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import RequestTemplateService from '../services/RequestTemplateService';
import LoadingModal from '../components/LoadingModal';

export default function RequestTemplateEditorPage() {

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
            "type": "text",
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

    const [templateInfo, setTemplateInfo] = useState({ name: '', description: '', language: '' })
    const [form, setForm] = useState(empty);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    const addIdIfMisingToForm = (list) => {
        for (let i in list) {
            if (list[i].id === undefined || list[i].id === null || list[i].id === '') {
                list[i].id = uuid();
            }
            if (list[i].component === undefined || list[i].component === null || list[i].component === ''){
                if (list[i].wrapper === 'title' || list[i].wrapper === 'dateAndSignature'){
                    list[i].component = list[i].wrapper;
                }else if (list[i].wrapper.startsWith("body")) {
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
                dl.push({ id: uuid(), name: docs[i] });
            }
        }
        return dl;
    }

    
    const getTemplate = async (tuuId) => {
        setLoading(true);
        try {
            const rt = await RequestTemplateService.getTemplateByUuid(tuuId);
            setTemplateInfo({ name: rt.name, description: rt.description, language: rt.language });
            setForm(addIdIfMisingToForm(rt.form));
            setRequiredDocuments(prepRequiredDocuments(rt.requiredDocuments));
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }
    
    useEffect(()=>{
        if (params.uuid !== undefined && params.uuid !== null && params.uuid !== '') {
            getTemplate(params.uuid);    
        }
    }, [params.ref] );

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
                let newVar = { ...variable };
                newVar.id = uuid();
                newVar.name = variableNames[index].slice(1, -1);
                newVariables.splice(index, 0, newVar);
            }
        }
        return newVariables;
    }

    const onFormChange = (event) => {
        const { id, value } = event.target;
        const { targetfield, partid } = event.target.dataset;
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
        const { id, value } = event.target;
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
            setRequiredDocuments([...requiredDocuments, { id: uuid(), name: '' }]);
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
        let ct = { ...part };
        ct.id = uuid();
        ct.wrapper = ct.id;
        tmp.splice(tmp.length - 1, 0, ct);
        setForm(tmp);
    }

    const onTemplateInfoChange = (event) => {
        const { id, value } = event.target;
        let tmp = { ...templateInfo };
        tmp[id] = value;
        setTemplateInfo(tmp);
    }

    const saveTemplate = () => {
        const template = {
            uuid: params.uuid,
            name: templateInfo.name,
            description: templateInfo.description,
            language: '',
            requiredDocuments: requiredDocuments.map((doc) => doc.name),
            form: form
        }
        console.log(template);
        RequestTemplateService.saveTemplate(template);
        
    }

    return (
        <Container >
            <LoadingModal show={loading} />
            <Form>
                <Container fluid className="box">
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Button variant="outline-danger">Megse</Button>
                        </Col>
                        <Col md="auto">
                            <Button variant="outline-success" onClick={saveTemplate}>Mentes</Button>
                        </Col>
                    </Row>
                </Container>
                <Container fluid className="box rowSpace">
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Kerveny Nev
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required type="text" placeholder="Pl.: Atsorolasi kerelem" value={templateInfo.name} id="name" onChange={onTemplateInfoChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            Leiras
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control required type="text" placeholder="Altalanos leiras" value={templateInfo.description} id="description" onChange={onTemplateInfoChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2} className="rowSpace">
                            Csatolmany lista
                        </Form.Label>
                        <Col sm={10}>
                            {requiredDocuments.map((doc) => {
                                return (
                                    <Row key={doc.id} className="rowSpace">
                                        <Col sm={11}>
                                            <Form.Control id={doc.id} onChange={onAttachmentChangeList} required type="text" placeholder="Kert csatolmany neve" value={doc.name} />
                                        </Col>
                                        <Col sm={1}>
                                            <Button variant="outline-danger" onClick={() => { deleteAttachment(doc.id) }}><i className="fas fa-minus"></i></Button>
                                        </Col>
                                    </Row>
                                )
                            })
                            }
                            <Row className="rowSpace">
                                <Col>
                                    <Button variant="outline-info" onClick={addNewAttachment}><i className="fas fa-plus"></i></Button>
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                </Container>
                <Container fluid className="box rowSpace">
                    {form.map((part) => {
                        if (part.component === "title") {
                            return (
                                <Row className="justify-content-md-center rowSpace">
                                    <Col xs lg={4} >
                                        <Form.Group>
                                            <Form.Control required id={part.id} type="text" placeholder="Hivatalos cim" style={{ 'textAlign': 'center' }} value={part.text} onChange={onFormChange} />
                                            <Form.Control.Feedback type="invalid">A kerveny neve kotelezo</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )
                        } else if (part.component === "body") {
                            if (part.type === 'text') {
                                return (
                                    <Container fluid className="rowSpace">
                                        <Row>
                                            <Col md="auto">
                                                <Button variant="outline-danger" onClick={() => { removeFormPart(part.id) }}><i className="fas fa-minus"></i></Button>
                                            </Col>
                                            <Col>
                                                <h3>Sablon szoveg szerkesztese</h3>
                                            </Col>
                                        </Row>
                                        <Row className="rowSpace">
                                            <Col>
                                                <Form.Control required id={part.id} as="textarea" style={{ textIndent: '2rem' }} rows={3} value={part.text} onChange={onFormChange} />
                                            </Col>
                                        </Row>
                                        <Row className="rowSpace">
                                            {!!part.variables && part.variables.map((v) => {
                                                return (<Col xs lg={4} className="box">
                                                    <Form.Group>
                                                        <Form.Label>Valtozo</Form.Label>
                                                        <Form.Control type="text" value={v.name} disabled />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>Utalas</Form.Label>
                                                        <Form.Control required id={v.id} data-partid={part.id} data-targetfield="hint" type="text" value={v.hint} onChange={onFormChange} />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>Tipus</Form.Label>
                                                        <Form.Control required id={v.id} data-partid={part.id} data-targetfield="type" as="select" onChange={onFormChange} value={v.type}>
                                                            <option value='text'>Szoveg</option>
                                                            <option value='number'>Szam</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    {v.type === 'number' &&
                                                        <Form.Row>
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Min</Form.Label>
                                                                <Form.Control required id={v.id} data-partid={part.id} data-targetfield="min" type="number" value={v.min} onChange={onFormChange} />
                                                            </Form.Group>
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Max</Form.Label>
                                                                <Form.Control required id={v.id} data-partid={part.id} data-targetfield="max" type="number" value={v.max} onChange={onFormChange} />
                                                            </Form.Group>
                                                        </Form.Row>}
                                                </Col>)
                                            })}
                                        </Row>
                                    </Container>
                                )
                            } else if (part.type === 'customText') {
                                return (
                                    <Container fluid className="rowSpace">
                                        <Row>
                                            <Col md="auto">
                                                <Button variant="outline-danger" onClick={() => { removeFormPart(part.id) }}><i className="fas fa-minus"></i></Button>
                                            </Col>
                                            <Col>
                                                <h3>Egyeni szovegbevitel</h3>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group as={Row}>
                                                    <Form.Label column sm={2}>
                                                        Utalas
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control required type="text" id={part.id} data-targetfield="hint" value={part.hint} onChange={onFormChange} />
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Control id={part.id} as="textarea" rows={2} disabled value="A kitolto hozasfuzest tehet a kervenyhez" />
                                            </Col>
                                        </Row>
                                    </Container>
                                )
                            }
                        } else if (part.component === "dateAndSignature") {
                            return (
                                <Container fluid className="rowSpace">
                                    <Row className="justify-content-md-center">
                                        <Col md="auto">
                                            <Button variant="outline-info" onClick={() => { addFormPart(text) }}><i className="fas fa-plus"></i> Sablon szoveg</Button>
                                        </Col>
                                        <Col md="auto">
                                            <Button variant="outline-info" onClick={() => { addFormPart(customText) }}> <i className="fas fa-plus"></i> Egyeni szovegbevitel</Button>
                                        </Col>
                                    </Row>
                                    <Row className="rowSpace">
                                        <Col>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5}>
                                                    <Form.Group>
                                                        <Form.Control id={part.id} data-targetfield="dateText" value={part.dateText} required type="text" placeholder="Datum cimke" style={{ 'textAlign': 'center' }} onChange={onFormChange} />
                                                        <Form.Control.Feedback type="invalid">A kerveny neve kotelezo</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5} className="text-center" style={{ 'fontSize': '3rem', 'color': 'blue' }}>
                                                    <i className="far fa-calendar-alt"></i>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5}>
                                                    <Form.Group>
                                                        <Form.Control id={part.id} data-targetfield="signatureText" required value={part.signatureText} type="text" placeholder="Alairas Cimke" style={{ 'textAlign': 'center' }} onChange={onFormChange} />
                                                        <Form.Control.Feedback type="invalid">Alairas Cimke</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-md-center">
                                                <Col xs lg={5} className="text-center" style={{ 'fontSize': '3rem', 'color': 'blue' }}>
                                                    <i className="fas fa-signature"></i>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                        }
                    })}
                </Container>
            </Form>
        </Container>
    )

}