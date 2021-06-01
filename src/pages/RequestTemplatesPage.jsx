import React, { useState } from "react";
import { Container, Button, CardDeck, Card } from "react-bootstrap";
import RequestTemplateService from '../services/RequestTemplateService';
import RequestPage from './RequestPage';

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
        return (<RequestPage template={templateInUse.template} close={closeRequestPage} />);
    }



    return (
        <Container>
            <h1>Request Templates</h1>
            <CardDeck>
                {templates.map((template, i) => {
                    return (<Card key={i}>
                        <Card.Body>
                            <Card.Title>{template.name}</Card.Title>
                            <Card.Text>{template.description}</Card.Text>
                            {template.upload &&
                                <div>
                                    <Card.Text>Documente necesare:</Card.Text>
                                    <ul>
                                        {template.upload.map((doc, i) => {
                                            return (<li key={i}>{doc.name}</li>)
                                        })}
                                    </ul>
                                </div>}
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="primary" onClick={() => setTemplateInUse({ template })}>Use</Button>
                        </Card.Footer>
                    </Card>)
                })}
            </CardDeck>
        </Container>
    );
}