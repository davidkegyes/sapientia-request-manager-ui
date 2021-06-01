import React, { Component } from "react";
import { Spinner, Modal, Row, Col, Container, Image } from "react-bootstrap";
import logo from '../assets/logo_hu.png'

export default class LoadingModal extends Component {

    render(){
        return (
            <Modal
              show={this.props.show}
              size="sm"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body>
                <Container>
                  <Row className="justify-content-center">
                    <Col xs="auto"><Image src={logo} fluid className="logo" title="Sapientia EMTE" alt="Sapientia EMTE" /></Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs="auto"><Spinner animation="border" variant="success" /></Col>
                  </Row>
                </Container>
              </Modal.Body>
            </Modal>
          )
    }

}