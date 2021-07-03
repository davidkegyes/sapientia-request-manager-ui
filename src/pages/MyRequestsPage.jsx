import React, {useState, useEffect, useMemo} from 'react';
import {Card, Container, Row, Col, Badge, Button} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import RequestServices from '../services/RequestService';
import TableComponent from "../components/TableComponent";

export default function MyRequestsPage(props) {

    let [myRequests, setMyRequests] = useState(undefined);
    const {t} = useTranslation();

    useEffect(() => {
        RequestServices.getrequestInfoList().then((res) => setMyRequests(res));
    }, [])

    const columns = useMemo(
        () => [

            {
                Header: 'Details',
                Cell: ({row}) => {
                    const request = row.original;
                    return (
                        <>
                                <h4>{request.name}</h4>
                                <p>{t("request.officialReferenceNumber")}: {request.officialReferenceNumber}</p>
                                <p>{t("request.referenceNumber")}: {request.referenceNumber}</p>
                                <small className="text-muted">{t("request.creationDate", {date: new Date(request.createDateTime)})}</small><br></br>
                                <small className="text-muted">{t("request.lastUpdate", {date: new Date()})}</small>
                          </>)
                }
            },
            {
              Header: 'Status',
              accessor: 'status',
                Cell : ({row}) => {
                    const request = row.original;
                    return (
                        <h5>
                            {request.status === 'NEW' && <Badge variant="primary">{t("request.status.new")}</Badge>}
                            {request.status === 'REJECTED' && <Badge variant="danger">{t("request.status.rejected")}</Badge>}
                            {request.status === 'APPROVED' && <Badge variant="success">{t("request.status.approved")}</Badge>}
                        </h5>
                    )}
            },
            {
                Header: 'Controls',
                disableFilters : true,
                disableGlobalFilter: true,
                Cell: ({ row }) => {
                    const request = row.original;
                    return (<NavLink to={{
                        pathname: "/inspect/" + encodeURIComponent(request.referenceNumber),
                        props: { request: request }
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
            { (myRequests === undefined || myRequests.length === 0) && <span>{t("page.myRequests.noRequestFound")}</span>}
            { myRequests !== undefined && myRequests.length > 0 && <TableComponent data={myRequests} columns={columns} className="myRequestTable"/>}


        </Container>
    );
}