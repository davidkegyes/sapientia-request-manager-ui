import React, {useState} from "react";
import {useAsyncDebounce} from "react-table";
import {Col, Form, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export default function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {

    const {t} = useTranslation()
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <Form>
            <Form.Group as={Row} controlId="globalFilterControl">
                <Form.Label column sm={2}>
                    {t("component.table.searchLabel")}
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" value={value || ""}
                                  onChange={e => {
                                      setValue(e.target.value);
                                      onChange(e.target.value);
                                  }}
                                  placeholder={t("component.table.searchPlaceHolder", {count: count})}/>
                </Col>
            </Form.Group>
        </Form>
    )
}