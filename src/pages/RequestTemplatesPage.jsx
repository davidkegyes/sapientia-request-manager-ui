import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, CardColumns, Col, Container, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import RequestTemplateService from '../services/RequestTemplateService';
import RequestPage from './RequestPage';
import {NavLink} from 'react-router-dom';
import Restricted from "../components/Restricted";
import {useGlobalFilter, useTable} from "react-table";
import GlobalFilter from "../components/GlobalFilterComponent";

export default function RequesTemplatesPage() {

    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [templateInUse, setTemplateInUse] = useState(undefined)


    const columns = useMemo(
        () => [
            {
                Header: 'Hoppa',
                accessor: (row) => row.name + " " + row.description + row.requiredDocuments.join(" "),
                Cell: ({row}) => {
                    let template = row.original
                    return (
                        <Card className="box">
                            <Card.Body>
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
                                <Row>
                                    <Col className="d-flex align-items-right justify-content-center">
                                        <Restricted permission="UPLOAD_APPLICATION">
                                            <Col md="auto">
                                                <Button variant="outline-info"
                                                        onClick={() => setTemplateInUse({template})}>{t("page.requestTemplates.useTemplate")}</Button>
                                            </Col>
                                        </Restricted>
                                        <Restricted permission="EDIT_APPLICATION_TEMPLATE">
                                            <Col>
                                                <NavLink to={"/templateEditor/" + template.uuid}
                                                         className='btn btn-outline-primary'>Szerkesztés</NavLink>
                                            </Col>
                                        </Restricted>
                                        <Restricted permission="DELETE_APPLICATION_TEMPLATE">
                                            <Col>
                                                <Button variant="outline-danger" onClick={() => {
                                                    deleteTemplate(template.uuid)
                                                }}>Törlés</Button>
                                            </Col>
                                        </Restricted>
                                    </Col>
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
        data,
    }, useGlobalFilter)

    useEffect(() => {
        RequestTemplateService.getRequestTemplates().then(templates => {
            if (templates) {
                setData(templates)
            } else {
                setData([]);
            }
        });
    }, [])

    function closeRequestPage() {
        setTemplateInUse(undefined);
        return this;
    }

    const deleteTemplate = (uuid) => {
        try {
            RequestTemplateService.deleteTemplate(uuid);
            setData(data.filter(t => t.uuid !== uuid));
        } catch (err) {
            alert("hiba a torlesnel")
        }
    }

    if (templateInUse !== undefined) {
        return (<RequestPage key={Math.random()} template={templateInUse.template} onClose={closeRequestPage}/>);
    }

    return (
        <Container fluid className="noPadding">
            <Row>
                <Col>
                    <h1>{t("page.requestTemplates.title")}</h1>
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