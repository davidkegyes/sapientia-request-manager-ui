import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap'
import TableComponent from '../components/TableComponent'
import LoadingModal from '../components/LoadingModal'
import { getUsers, saveUser } from '../services/UserService';
import RoleSelectComponent from '../components/RoleSelectComponent'

function UserEditForm(props) {
    const { user, onHide, onChange, onSave } = props;
    if (user === null) {
        return ("");
    }
    return (<Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit User
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label>Firstname</Form.Label>
                <Form.Control type="text" placeholder="Firstname" id="firstname" onChange={onChange} disabled value={user.firstname} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Lastname</Form.Label>
                <Form.Control type="text" placeholder="Lastname" disabled id="lastname" onChange={onChange} value={user.lastname} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Mail</Form.Label>
                <Form.Control type="email" placeholder="Mail" disabled id="email" onChange={onChange} value={user.email} />
            </Form.Group>
            <Form.Group>
                <Form.Label>NeptunCode</Form.Label>
                <Form.Control type="text" placeholder="NeptunCode" id="neptunCode" onChange={onChange} value={user.neptunCode} />
            </Form.Group>
            <RoleSelectComponent id="role" label="Role" selected={JSON.stringify(user.role)} onSelect={onChange} />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
            <Button variant="outline-info" onClick={onHide}>Close</Button>
            <Button variant="outline-success" onClick={onSave}>Save changes</Button>
        </Modal.Footer>
    </Modal>
    );
}

export default function UserManagementPage() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editedUser, setEditedUser] = useState(null);
    const [error, setError] = useState(null);

    const columns = useMemo(
        () => [
            {
                Header: "User",
                Cell: ({ row }) => {
                    let user = row.original;
                    return (
                        <Container fluid className="noPadding">
                            <Row>
                                <Col>Firstname</Col>
                                <Col>{user.firstname}</Col>
                            </Row>
                        </Container>
                    )
                }
            },

            {
                Header: 'First Name',
                accessor: 'firstname',
            },
            {
                Header: 'Last Name',
                accessor: 'lastname',
            },
            {
                Header: 'Mail',
                accessor: 'email',
            },
            {
                Header: 'NeptunCode',
                accessor: 'neptunCode',
            },
            {
                Header: 'Role',
                accessor: 'role.name'
            },
            {
                Header: 'Controls',
                disableFilters: true,
                disableGlobalFilter: true,
                Cell: ({ row }) => (<Button variant="outline-primary" onClick={() => editRow(row)}>Edit</Button>)
            }
        ],
        []
    )

    useEffect(() => {
        const getUsersFromServer = async () => {
            setLoading(true);
            try {
                setUsers(await getUsers());
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
        getUsersFromServer();
    }, []);

    const editRow = (row) => {
        console.log(row.original)
        setEditedUser(row.original)
    }

    const onFormInputChange = (event) => {
        const { id, value } = event.target;
        let tmp = { ...editedUser }
        if (id === 'role') {
            tmp.role = JSON.parse(value);
        } else {
            tmp[id] = value;
        }
        setEditedUser(tmp);

    }

    const saveChanges = async () => {
        setLoading(true);
        const userToBeSaved = { ...editedUser };
        userToBeSaved.roleId = userToBeSaved.role.id;
        delete userToBeSaved.role;
        setEditedUser(null);
        saveUser(userToBeSaved).then((user) => {
            const tmp = [...users];
            for (let i in tmp) {
                if (tmp[i].id === user.id) {
                    tmp[i] = user;
                    break;
                }
            }
            setUsers(tmp);
            setLoading(false);
        }).catch((err) => {
            // todo better eror handling
            setError(err);
            setLoading(false);
        })
    }

    return (
        <Container fluid className="noPadding">
            <LoadingModal show={loading} />
            {error !== null && <Alert variant="danger">Error on save</Alert>}
            <UserEditForm show={editedUser !== null} user={editedUser} onSave={saveChanges} onChange={onFormInputChange} onHide={() => setEditedUser(null)} />
            <TableComponent data={users} columns={columns} />
        </Container>
    )
}