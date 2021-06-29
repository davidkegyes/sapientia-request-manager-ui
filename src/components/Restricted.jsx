import React, { useContext } from 'react'
import { UserContext } from '../App';

export default function Restricted({ permission, children }) {

    const userContext = useContext(UserContext)

    const user = userContext.user;
    if (user && (user.role.name === permission || user.role.permissions.includes(permission))) {
        return (<>{children}</>);
    }

    return null;
}