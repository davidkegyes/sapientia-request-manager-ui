import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from "../App";

const ProtectedRoute = ({ component: Component, user, permission, ...rest }) => {

  const context = useContext(UserContext);

  return (
    <Route {...rest} render={
      props => {
        if (context.user) {
          if (permission === undefined || context.user.role.name === permission || context.user.role.permissions.includes(permission)) {
            return <Component {...rest} {...props} />
          } else {
            return <Redirect to='/'/>
          }
        } else {
          return <Redirect to={
            {
              pathname: '/login',
              state: {
                from: window.location.pathname
              }
            }
          } />
        }
      }
    } />
  )
}

export default ProtectedRoute;