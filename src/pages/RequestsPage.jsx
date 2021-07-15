import React, {useEffect, useMemo, useState} from 'react';
import {Badge, Col, Container, Row} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import RequestServices from '../services/RequestService';
import TableComponent from "../components/TableComponent";

export default function MyRequestsPage(props) {

    let [myRequests, setMyRequests] = useState(undefined);
    const {t} = useTranslation();

    useEffect(() => {
        RequestServices.getAllRequestRequestInfoList().then((res) => setMyRequests(res));
    }, [])

    const getValuesString = (obj) => {
        let strs = [];
        if (obj === null && obj === undefined) {
            return "";
        }
        try {
            Object.values(obj).forEach((st) => {
                if (typeof st === 'object') {
                    strs = [...strs, getValuesString(st)]
                } else {
                    strs.push(st);
                }
            });
        } catch (err) {

        }
        return strs.join(" ");
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Created',
                accessor: (row) => new Date(row.createDateTime),
                sortType: 'datetime',
                Cell: ({cell: {value}}) => <span>{t('date', {date: value})}</span>
            },
            // {
            //     Header: 'Updated',
            //     accessor: (row) => new Date(row.updateDateTime),
            //     sortType: 'datetime',
            //     show: false,
            //     Cell: ({cell: {value}}) => <span>{t('date', {date: value})}</span>
            // },
            {
                Header: 'Details',
                accessor: (row) => getValuesString(row),
                Cell: ({row}) => {
                    const request = row.original;
                    return (
                        <Container>
                            <Row>
                                <Col className="box">
                                    <h4>{request.name}</h4>
                                    <Row>
                                        <Col><strong>Uploaded by:</strong></Col>
                                        <Col>{request.user.firstname + " " + request.user.lastname}</Col>
                                    </Row>
                                    <Row>
                                        <Col><strong>Neptun Code</strong></Col>
                                        <Col>{request.user.neptunCode}</Col>
                                    </Row>
                                    {request.status !== 'NEW' &&
                                    (<Row>
                                        <Col>
                                            {request.status === 'APPROVED' && <strong>Approved by</strong>}
                                            {request.status === 'REJECTED' && <strong>Rejected by</strong>}
                                        </Col>
                                        <Col>
                                            {request.inspectorUser ? (request.inspectorUser.firstname + " " + request.inspectorUser.lastname) : ""}
                                        </Col>
                                    </Row>)
                                    }
                                    <p>{t("request.referenceNumber")}: {request.referenceNumber}</p>
                                </Col>
                            </Row>
                        </Container>)
                }
            },
            {
                Header: 'RegNumber',
                accessor: 'officialReferenceNumber'
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: ({row}) => {
                    const request = row.original;
                    return (
                        <h5>
                            {request.status === 'NEW' && <Badge variant="primary">{t("request.status.new")}</Badge>}
                            {request.status === 'REJECTED' &&
                            <Badge variant="danger">{t("request.status.rejected")}</Badge>}
                            {request.status === 'APPROVED' &&
                            <Badge variant="success">{t("request.status.approved")}</Badge>}
                        </h5>
                    )
                }
            },
            {
                Header: ' ',
                disableFilters: true,
                disableGlobalFilter: true,
                Cell: ({row}) => {
                    const request = row.original;
                    return (<NavLink to={{
                        pathname: "/inspect/" + encodeURIComponent(request.referenceNumber),
                        props: {request: request}
                    }} className='btn btn-outline-info ml-auto'>
                        <span>{t("page.myRequests.openRequest")}</span>
                    </NavLink>)
                }
            }
        ],
        []
    )

    return (
        <Container fluid className="noPadding">
            <h1>{t("page.myRequests.title")}</h1>
            {(myRequests === undefined || myRequests.length === 0) &&
            <span>{t("page.myRequests.noRequestFound")}</span>}
            {myRequests !== undefined && myRequests.length > 0 &&
            <TableComponent data={myRequests} columns={columns} className="myRequestTable"/>}
        </Container>
    );
}