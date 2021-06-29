import React from 'react'
import { useTable, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { Container, Row, Col, Table, Form } from 'react-bootstrap'

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
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


    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter
    } = useTable({
        columns,
        data,
    }, useGlobalFilter)

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
                            {rows.map((row, i) => {
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
        </Container>
    )
}