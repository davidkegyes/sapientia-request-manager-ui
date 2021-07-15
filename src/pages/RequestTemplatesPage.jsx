import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, CardColumns, Col, Container, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import {NavLink} from 'react-router-dom';
import Restricted from "../components/Restricted";
import {useGlobalFilter, useTable} from "react-table";
import GlobalFilter from "../components/GlobalFilterComponent";

export default function RequesTemplatesPage() {

    const {t} = useTranslation();
    const [data, setData] = useState([]);

    const columns = useMemo(
        () => [
            {
                id: 'requests',
                accessor: (row) => row.name + " " + row.description + row.requiredDocuments.join(" "),
                Cell: ({row}) => {
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
                                            <NavLink to={"/editTemplate/" + template.uuid}
                                                     className='btn btn-outline-info'>{t("page.requestTemplates.editTemplate")}</NavLink>
                                        </Col>
                                    </Restricted>
                                    <Restricted permission="DELETE_APPLICATION_TEMPLATE">
                                        <Col xs="auto">
                                            <Button variant="outline-danger" onClick={() => {
                                                deleteTemplate(template.uuid)
                                            }}>{t("page.requestTemplates.deleteTemplate")}</Button>
                                        </Col>
                                    </Restricted>
                                </Row>
                                <Row className="justify-content-md-center rowSpace">
                                    <Restricted permission="UPLOAD_APPLICATION">
                                        <Col xs="auto">
                                            <NavLink to={"/request/" + template.uuid}
                                                     className='btn btn-outline-success'>{t("page.requestTemplates.useTemplate")}</NavLink>
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
            <Row>
                <Col>
                    <h1>{t("page.requestTemplates.title")}</h1>
                </Col>
                <Restricted permission='EDIT_APPLICATION_TEMPLATE'>
                    <Col className='d-flex align-items-center'>
                        <NavLink to="/createTemplate" className='btn btn-outline-info ml-auto'>{t("page.requestTemplates.createTemplate")}</NavLink>
                    </Col>
                </Restricted>
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