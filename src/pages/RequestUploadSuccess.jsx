import React from "react";
import { Container, Row, Jumbotron } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

export default function RequestUploadSuccess(props) {

    return (
        <Container>
            <Row className="justify-content-center">
                <Jumbotron >
                    <h1>Upload {props.errors === undefined || props.errors.length === [] ? 'Success' : 'Completed with errors'}</h1>
                    <h2>Ref: {props.refNumber}</h2>
                    {/* <NavLink to={{
                        pathname: "/inspect/" + encodeURIComponent(props.refNumber)
                    }} className='btn btn-outline-info ml-auto'>
                        <span>View</span>
                    </NavLink> */}
                </Jumbotron>
            </Row>
        </Container>
    )

}