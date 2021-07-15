import React from 'react'
import {useGlobalFilter, usePagination, useSortBy, useTable} from 'react-table'
import {Col, Container, Form, Pagination, Row, Table} from 'react-bootstrap'
import GlobalFilter from "./GlobalFilterComponent";
import './TableComponent.css'
import {useFlexLayout} from "react-table/src/plugin-hooks/useFlexLayout";
import {useTranslation} from "react-i18next";

export default function TableComponent({columns, data}) {

    const {t} = useTranslation();

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        preGlobalFilteredRows,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state,
        state: {pageIndex, pageSize},
    } = useTable({
            columns,
            data,
            initialState: {
                pageIndex: 0,
                hiddenColumns: columns.filter(col => col.show === false).map(col => col.accessor)
            },
        },
        useFlexLayout, useGlobalFilter, useSortBy, usePagination
    )

    return (
        <Container fluid className="noPadding">
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
                    <Table striped hover responsive className="tableStyle" {...getTableProps()}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <i class="fas fa-sort-down"></i>
                                                : <i class="fas fa-sort-up"></i>
                                            : ''}
                                      </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col>
                    <label>
                        {t("component.table.pagination.page", {current: pageIndex + 1, total: pageOptions.length})}
                    </label>
                </Col>
                <Col>
                    <Pagination>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage}/>
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage}/>
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage}/>
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}/>
                    </Pagination>
                </Col>
                <Col md={'auto'}>
                    <Form>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Control as="select"
                                          value={pageSize}
                                          onChange={e => {
                                              setPageSize(Number(e.target.value))
                                          }}>
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {t("component.table.pagination.show", {count: pageSize})}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}