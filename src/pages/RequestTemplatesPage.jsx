import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardColumns, Col, Container, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import { NavLink } from 'react-router-dom';
import Restricted from "../components/Restricted";
import { useGlobalFilter, useTable } from "react-table";
import {downloadPdf} from '../services/RequestPDFService';
import GlobalFilter from "../components/GlobalFilterComponent";
import "./RequestTemplatesPage.css"

export default function RequesTemplatesPage() {

    const { t } = useTranslation();
    const [data, setData] = useState([]);

    const columns = useMemo(
        () => [
            {
                id: 'requests',
                accessor: (row) => row.name + " " + row.description + row.requiredDocuments.join(" "),
                Cell: ({ row }) => {
                    let template = row.original
                    return (
                        <Card className="box">
                            <Card.Body>
                                <Row>
                                    <Col className="noPadding">
                                        <Card.Title>{template.name}</Card.Title>
                                        <Card.Text>{template.description}</Card.Text>
                                        {(template.requiredDocuments && template.requiredDocuments.length > 0) &&
                                            <div>
                                                <Card.Text>{t("request.requiredDocuments")}:</Card.Text>
                                                <ul>
                                                    {template.requiredDocuments.map((doc, i) => {
                                                        return (<li key={i}>{doc}</li>)
                                                    })}
                                                </ul>
                                            </div>}
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-center rowSpace">
                                    <Restricted permission="EDIT_APPLICATION_TEMPLATE">
                                        <Col xs="auto">
                                            <OverlayTrigger
                                                placement='bottom'
                                                overlay={
                                                    <Tooltip>
                                                        {t('page.requestTemplates.editTemplate')}
                                                    </Tooltip>
                                                }
                                            >
                                                <NavLink to={"/editTemplate/" + template.uuid}
                                                    className='btn btn-outline-info template-button'><i class="fas fa-wrench"></i></NavLink>
                                            </OverlayTrigger>
                                        </Col>
                                    </Restricted>
                                    <Restricted permission="DELETE_APPLICATION_TEMPLATE">
                                        <Col xs="auto">
                                        <OverlayTrigger
                                                placement='bottom'
                                                overlay={
                                                    <Tooltip>
                                                        {t('page.requestTemplates.deleteTemplate')}
                                                    </Tooltip>
                                                }
                                            >
                                            <Button variant="outline-danger" className="template-button" onClick={() => {
                                                deleteTemplate(template.uuid)
                                            }}><i class="far fa-trash-alt"></i></Button></OverlayTrigger>
                                        </Col>
                                    </Restricted>
                                    <Col xs="auto">
                                    <OverlayTrigger
                                                placement='bottom'
                                                overlay={
                                                    <Tooltip>
                                                        {t('page.requestTemplates.downloadTemplate')}
                                                    </Tooltip>
                                                }
                                            >
                                        <Button variant="outline-primary" onClick={() => downloadPdf(template.form, template.name)} className="template-button"><i class="fas fa-file-download"></i></Button>
                                        </OverlayTrigger>
                                    </Col>
                                    <Restricted permission="UPLOAD_APPLICATION">
                                        <Col xs="auto">
                                        <OverlayTrigger
                                                placement='bottom'
                                                overlay={
                                                    <Tooltip>
                                                        {t('page.requestTemplates.useTemplate')}
                                                    </Tooltip>
                                                }
                                            >
                                            <NavLink to={"/request/" + template.uuid}
                                                className='btn btn-outline-success template-button'><i class="fas fa-edit"></i></NavLink>
                                                </OverlayTrigger>
                                        </Col>
                                    </Restricted>
                                </Row>
                            </Card.Body>
                        </Card>
                    )
                }
            }
        ],
        []
    )

    const {
        rows,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
        state,
    } = useTable({
        columns,
        data
    }, useGlobalFilter)

    const getTemplates = () => {
        RequestTemplateService.getRequestTemplates().then(templates => {
            if (templates) {
                setData(templates)
            } else {
                setData([]);
            }
        });
    }

    useEffect(() => {
        getTemplates();
    }, [])


    const deleteTemplate = async (uuid) => {
        try {
            await RequestTemplateService.deleteTemplate(uuid);
            getTemplates();
        } catch (err) {
            alert("hiba a torlesnel")
        }
    }

    return (
        <Container fluid className="noPadding">
            <Row className="align-items-md-centers">
                <Col>
                    <h1>{t("page.requestTemplates.title")}</h1>
                </Col>
                <Col md="auto">
                    <Row>
                        <Col md="auto">
                            <Restricted permission='EDIT_APPLICATION_TEMPLATE'>
                                <NavLink to="/createTemplate" className='btn btn-outline-info'>{t("page.requestTemplates.createTemplate")}</NavLink>
                            </Restricted>
                        </Col>
                        <Col md="auto">
                            <NavLink to="/customRequest" className='btn btn-outline-info'>{t("page.customRequest.title")}</NavLink>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardColumns>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                row.cells.map(cell => {
                                    return cell.render('Cell')
                                })
                            )
                        })}
                    </CardColumns>
                </Col>
            </Row>
        </Container>
    );
}