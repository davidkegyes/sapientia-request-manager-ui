import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import RestTemplate from '../services/RestTemplate';
import config from '../config';

export default function RoleSelectComponent({ id, label, selected }) {

    const [roles, setRoles] = useState(null);
    useEffect(() => {
        const getRolesFromServer = async () => {
            try {
                setRoles(await RestTemplate.get(config.rest.getRoles));
            } catch (err) {
                console.log(err);
            }
        }
        getRolesFromServer();
    }, []);

    if (roles === null) {
        return (<Form.Control as="select">
            <option>Loading...</option>
        </Form.Control>)
    }

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={selected} id={id}>
                {roles.map((r) => {
                    return (<option value={JSON.stringify(r)}>{r.name}</option>)
                })}
            </Form.Control>
        </Form.Group>
    );

}