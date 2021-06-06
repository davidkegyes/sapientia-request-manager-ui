import React from 'react'
import {Container, Row, Col, Spinner, Image} from 'react-bootstrap'
import logo from '../assets/logo_hu.png'

export default function LoadingComponent({text}) {
    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col xs="auto"><Image src={logo} style={{width: '15rem'}} className="logo" title="Sapientia EMTE" alt="Sapientia EMTE" /></Col>
            </Row>
            {text && <Row className="justify-content-center">
                <Col xs="auto"><label>{text}</label></Col>
            </Row>}
            <Row className="justify-content-center">
                <Col xs="auto"><Spinner animation="border" variant="success" /></Col>
            </Row>
        </Container>);
}