import React, {useState} from 'react'
import {useAsyncDebounce, useGlobalFilter, usePagination, useTable} from 'react-table'
import {Col, Container, Form, Pagination, Row, Table} from 'react-bootstrap'

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    gotToFirstPage,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <Form>
            <Form.Group as={Row} controlId="globalFilterControl">
                <Form.Label column sm={2}>
                    Kereses
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" value={value || ""}
                        onChange={e => {
                            setValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        placeholder={`${count} records...`} />
                </Col>
            </Form.Group>
        </Form>
    )
}
export default function TableComponent({ columns, data }) {

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
        state: {pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
    }, useGlobalFilter, usePagination)

    // Render the UI for your table
    return (
        <Container fluid>
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
                    <Table striped bordered hover responsive {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                        {pageIndex + 1} of {pageOptions.length}
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
                                        Show {pageSize}
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