import React from 'react'
import { Container ,Row, Col} from 'react-bootstrap'

export default function NotFoundPage() {

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="text-center">
                    <span class="display-1 d-block">404</span>
                    <div class="mb-4 lead">The page you are looking for was not found.</div>
                    <a href="/" class="btn btn-link">Back to Home</a>
                </Col>
            </Row>
        </Container>
    )

}