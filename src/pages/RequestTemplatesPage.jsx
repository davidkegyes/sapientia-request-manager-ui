import React, { useState } from "react";
import { Container, Button, Card, CardColumns, Row, Col } from "react-bootstrap";
import RequestTemplateService from '../services/RequestTemplateService';
import RequestPage from './RequestPage';
import UploadComponent  from '../components/UploadComponenet';

export default function RequesTemplatesPage(props) {

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
            <h1>Kérvények</h1>
            <CardColumns>
                {templates.map((template, i) => {
                    return (
                            <Card key={i} className="box">
                                <Card.Body>
                                    <Card.Title>{template.name}</Card.Title>
                                    <Card.Text>{template.description}</Card.Text>
                                    {(template.attachmentList && template.attachmentList.length > 0) &&
                                        <div>
                                            <Card.Text>Documente necesare:</Card.Text>
                                            <ul>
                                                {template.attachmentList.map((doc, i) => {
                                                    return (<li key={i}>{doc.name}</li>)
                                                })}
                                            </ul>
                                        </div>}
                                    <div className="d-flex align-items-right justify-content-center">
                                        <Button variant="primary" onClick={() => setTemplateInUse({ template })}>Kitöltés</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                })}
            </CardColumns>
        </Container>
    );
}