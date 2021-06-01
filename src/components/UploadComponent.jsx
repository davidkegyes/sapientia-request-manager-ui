import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export default class UploadComponent extends Component {

    render() {
        return (
            <>
                {
                    this.props.upload.map(doc => {
                        return (
                            <Row key={doc.name} className="rowSpace">
                                <Col className>
                                    <label>{doc.name}</label><br></br>
                                    <small>Accepted format:{doc.accept}</small>
                                </Col>
                                <Col>
                                    <i className="fas fa-upload"></i>{" "}<input name={doc.name} type="file" accept={doc.accept} multiple={false} onChange={this.props.handleChange}></input>
                                </Col>
                            </Row>)
                    })
                }
            </>)
    }

}