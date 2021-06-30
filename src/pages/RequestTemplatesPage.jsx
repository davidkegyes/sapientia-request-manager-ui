import React, { useState, useEffect } from "react";
import { Container, Button, Card, CardColumns, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import RequestPage from './RequestPage';
import { NavLink } from 'react-router-dom';
import Restricted from "../components/Restricted";
export default function RequesTemplatesPage() {

    const { t } = useTranslation();
    let [templates, setTemplates] = useState([]);
    let [templateInUse, setTemplateInUse] = useState(undefined)

    useEffect(() => {
        RequestTemplateService.getRequestTemplates().then(templates => {
            if (templates) {
                setTemplates(templates)
            } else {
                setTemplates([]);
            }
        });
    }, [])

    function closeRequestPage() {
        setTemplateInUse(undefined);
        return this;
    }

    const deleteTemplate = (uuid) => {
        try {
            RequestTemplateService.deleteTemplate(uuid);
            setTemplates(templates.filter(t => t.uuid !== uuid));
        } catch (err) {
            alert("hiba a torlesnel")
        }
    }

    if (templateInUse !== undefined) {
        return (<RequestPage key={Math.random()} template={templateInUse.template} onClose={closeRequestPage} />);
    }

    return (
        <Container>
            <h1>{t("page.requestTemplates.title")}</h1>
            <CardColumns>
                {templates.map((template, i) => {
                    return (
                        <Card key={i} className="box">
                            <Card.Body>
                                <Card.Title>{template.name}</Card.Title>
                                <Card.Text>{template.description}</Card.Text>
                                {(template.requiredDocuments && template.requiredDocuments.length > 0) &&
                                    <div>
                                        <Card.Text>{t("request.requiredDocuments")}:</Card.Text>
                                        <ul>
                                            {template.requiredDocuments.map((doc, i) => {
                                                return (<li key={i}>{doc}</li>)
                                            })}
                                        </ul>
                                    </div>}
                                <Row>
                                    <Col className="d-flex align-items-right justify-content-center">
                                        <Restricted permission="UPLOAD_APPLICATION">
                                            <Col md="auto">
                                                <Button variant="outline-info" onClick={() => setTemplateInUse({ template })}>{t("page.requestTemplates.useTemplate")}</Button>
                                            </Col>
                                        </Restricted>
                                        <Restricted permission="EDIT_APPLICATION_TEMPLATE" >
                                            <Col>
                                                <NavLink to={"/templateEditor/" + template.uuid} className='btn btn-outline-primary'>Szerkesztés</NavLink>
                                            </Col>
                                        </Restricted>
                                        <Restricted permission="DELETE_APPLICATION_TEMPLATE" >
                                            <Col>
                                                <Button variant="outline-danger" onClick={() => { deleteTemplate(template.uuid) }}>Törlés</Button>
                                            </Col>
                                        </Restricted>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )
                })}
            </CardColumns>
        </Container>
    );
}