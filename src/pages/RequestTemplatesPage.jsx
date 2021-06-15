import React, { useState } from "react";
import { Container, Button, Card, CardColumns} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import RequestPage from './RequestPage';

export default function RequesTemplatesPage() {

    const {t} = useTranslation();
    let [templates, setTemplates] = useState([]);
    let [templateInUse, setTemplateInUse] = useState(undefined)

    if (templates.length === 0) {
        RequestTemplateService.getRequestTemplates().then(templates => {
            if (templates) {
                setTemplates(templates)
            } else {
                setTemplates([]);
            }
        });
    }

    function closeRequestPage() {
        setTemplateInUse(undefined);
        return this;
    }

    if (templateInUse !== undefined) {
        return (<RequestPage key={Math.random()} template={templateInUse.template} close={closeRequestPage} />);
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
                                    {(template.attachmentList && template.attachmentList.length > 0) &&
                                        <div>
                                            <Card.Text>{t("request.requiredDocuments")}:</Card.Text>
                                            <ul>
                                                {template.attachmentList.map((doc, i) => {
                                                    return (<li key={i}>{doc.name}</li>)
                                                })}
                                            </ul>
                                        </div>}
                                    <div className="d-flex align-items-right justify-content-center">
                                        <Button variant="outline-info" onClick={() => setTemplateInUse({ template })}>{t("page.requestTemplates.useTemplate")}</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                })}
            </CardColumns>
        </Container>
    );
}