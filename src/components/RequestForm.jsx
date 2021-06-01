
import React, { Component } from "react";
import RequestTextComponent from './RequestTextComponent'
import SignatureCanvas from 'react-signature-canvas'
import { Row, Col, Container } from "react-bootstrap";
import './RequestForm.css'

export default class RequestForm extends Component {

    sigPad = {}

    generateHTML(request) {
        let htmlParts = [];
        let toBeWrapped = [];
        let wrapper = undefined;
        request.forEach((part, index) => {
            if (wrapper === undefined) {
                wrapper = part.wrapper;
            }
            if (wrapper !== part.wrapper) {
                htmlParts.push(<Row key={wrapper} className={wrapper + " rowSpace"}>{toBeWrapped}</Row>)
                toBeWrapped = []
                wrapper = part.wrapper
            }
            toBeWrapped.push(<Col key={wrapper + 'col' + index} className={part.style}>{this.getHTMLPart(part)}</Col>)
        })
        htmlParts.push(<Row key={wrapper} className={wrapper + " rowSpace"}>{toBeWrapped}</Row>)
        return htmlParts;
    }

    getHTMLPart(part) {
        if (part.type === 'text') {
            return (<RequestTextComponent variables={part.variables} text={part.text} handleChange={this.props.handleChange} />)
        } else if (part.type === 'customText') {
            return (<textarea key={part.wrapper + part.name} style={{ width: '100%' }} name={part.name} value={part.value} onChange={this.props.handleChange} />)
        } else if (part.type === 'dateAndSignature') {
            return (
                <Row className="justify-content-center">
                    <Col className="d-flex flex-column align-items-center">
                        <label>{part.dateText}</label>
                        <label>{part.dateValue}</label>
                    </Col>
                    <Col className="d-flex flex-column align-items-center">
                        <label>{part.signatureText}</label>
                        <div className="sigCanvasContainer">
                            <SignatureCanvas penColor='blue' canvasProps={{ className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} onEnd={() => { this.props.handleChange({ target: { name: part.type, value: this.sigPad.getTrimmedCanvas().toDataURL(), type: part.type } }) }} />
                            <button type="button" className="close canvasControl hide" aria-label="Clear" onClick={() => { this.sigPad.clear(); this.props.handleChange({ target: { name: part.type, value: undefined, type: part.type } }) }}>
                                <span aria-hidden="false">&times;</span>
                            </button>
                        </div>
                    </Col>
                </Row> 
            );
        }
    }
    render() {
        return (
            <Container>
                <Row className="rowSpace">
                    <Col className='requestForm'>
                        {this.generateHTML(this.props.request)}
                    </Col>
                </Row>
            </Container>
        );
    }
}