
import React from "react";
import RequestFormTextComponent from './RequestFormTextComponent'
import SignatureCanvas from 'react-signature-canvas'
import { Row, Col, Container, Alert } from "react-bootstrap";
import moment from "moment";
import './RequestForm.css'


export default function RequestForm({ form, onChange }) {

    let sigPad = {}

    const requestForm = form;

    function generateHTML() {
        let htmlParts = [];
        let toBeWrapped = [];
        let wrapper = undefined;
        requestForm.forEach((part, index) => {
            if (wrapper === undefined) {
                wrapper = part.wrapper;
            }
            if (wrapper !== part.wrapper) {
                htmlParts.push(<Row key={wrapper} className="rowSpace">{toBeWrapped}</Row>)
                toBeWrapped = []
                wrapper = part.wrapper
            }
            toBeWrapped.push(<Col key={wrapper + 'col' + index} className={part.type}>{getHTMLPart(part)}</Col>)
        })
        htmlParts.push(<Row key={wrapper} className={wrapper + " rowSpace"}>{toBeWrapped}</Row>)
        return htmlParts;
    }

    function getHTMLPart(part) {
        if (part.type === 'title'){
            return (<h3>{part.text}</h3>)
        }else if (part.type === 'text') {
            return (<RequestFormTextComponent variables={part.variables} text={part.text} handleChange={handleChange} />)
        } else if (part.type === 'customText') {
            console.log(part);
            return (<textarea key={part.wrapper + part.name} style={{ width: '100%' }} id={part.id} name={part.name} value={part.value} onChange={handleChange} />)
        } else if (part.type === 'dateAndSignature') {
            return (
                <Row className="justify-content-center">
                    <Col className="d-flex flex-column align-items-center">
                        <label>{part.dateText}</label>
                        <label>{part.dateValue ? part.dateValue : moment().format("YYYY-MM-DD")}</label>
                    </Col>
                    <Col className="d-flex flex-column align-items-center">
                        <label>{part.signatureText}</label>

                        <div className="sigCanvasContainer">
                            <SignatureCanvas 
                            penColor='blue' 
                            canvasProps={{ className: 'sigCanvas' }} 
                            ref={(ref) => { sigPad = ref }} 
                            onEnd={() => { handleChange({ target: { name: part.type, value: sigPad.getTrimmedCanvas().toDataURL(), type: part.type } }) }} />
                            <button type="button" className="close canvasControl hide" aria-label="Clear" onClick={() => { sigPad.clear(); handleChange({ target: { name: part.type, value: undefined, type: part.type } }) }}>
                                <span aria-hidden="false">&times;</span>
                            </button>
                        </div>
                    </Col>
                </Row>
            );
        }
    }

    function handleChange(event) {
        const { id, name, value, type } = event.target;
        let tmpForm = [...requestForm];
        for (let i in tmpForm) {
            console.log(id)
            if (type === 'dateAndSignature' && tmpForm[i].type === type) {
                tmpForm[i].signatureValue = value;
                tmpForm[i].dateValue = moment().format("YYYY-MM-DD");
                break;
            } else if (type === 'textarea' && tmpForm[i].type === 'customText' && tmpForm[i].id === id) {
                tmpForm[i].value = value;
                break;
            } else {
                if (tmpForm[i].variables === undefined) {
                    continue;
                }
                let filled = false;
                for (let v in tmpForm[i].variables) {
                    if (tmpForm[i].variables[v].name === name) {
                        tmpForm[i].variables[v].value = value;
                        filled = true;
                        break;
                    }
                }
                if (filled) {
                    break;
                }
            }
        }
        if (onChange) {
            onChange(requestForm);
        }
    }

    return (
        <Container>
            {form.errors && form.errors.map((error, index) => (
                <Row key={error}>
                    <Col className="noPadding">
                        <Alert key={error + '-' + index} variant='danger'>{error}</Alert>
                    </Col>
                </Row>
            ))}
            <Row className="rowSpace justify-content-center">
                <Col className='box requestForm'>
                    {generateHTML()}
                </Col>
            </Row>
        </Container>
    );
}