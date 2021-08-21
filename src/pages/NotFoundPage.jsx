import React from 'react'
import { Container ,Row, Col} from 'react-bootstrap'
import {useTranslation} from 'react-i18next';

export default function NotFoundPage() {
    const {t} = useTranslation();

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col className="text-center">
                    <span class="display-1 d-block">{t("page.notFound.title")}</span>
                    <div class="mb-4 lead">{t("page.notFound.description")}</div>
                    <a href="/" class="btn btn-link">{t("page.notFound.backToHome")}</a>
                </Col>
            </Row>
        </Container>
    )

}