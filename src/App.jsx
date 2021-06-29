import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from 'react-bootstrap'
import NavigationBar from './components/NavigationBar'
import RequestTemplatesPage from './pages/RequestTemplatesPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestInspectorPage from './pages/RequestInspectorPage'
import CustomRequestPage from './pages/CustomRequestPage'
import RequestTemplateEditorPage from './pages/RequestTemplateEditorPage'
import UserManagementPage from "./pages/UserManagementPage";
import { getUserDetails } from './services/UserService'
import './App.css'
import { useTranslation } from 'react-i18next';

export const UserContext = React.createContext({});

export default function App() {

  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = t("title")
  }, [i18n]);

  const handleLogin = (user) => {
    setUser(user);
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  }

  const isLoggedIn = () => {
    if (localStorage.getItem('token')){
      return true;
    }
    return false;
  }

  return (
    <UserContext.Provider value={{ user: user, isLoggedIn: isLoggedIn }}>
      <React.Fragment>
        <Router>
          {user && <NavigationBar user={user} handleLogout={handleLogout} />}
          <Switch>
            <Container>
              <Route path="/login" component={() => <LoginPage handleLogin={handleLogin} />} />
              <ProtectedRoute exact path="/" component={RequestTemplatesPage} />
              <ProtectedRoute path="/templateEditor/:uuid" component={RequestTemplateEditorPage} />
              <ProtectedRoute path="/templateEditor" component={RequestTemplateEditorPage} />
              <ProtectedRoute path="/customRequest" component={CustomRequestPage} />
              <ProtectedRoute path="/myRequests" component={MyRequestsPage} />
              <ProtectedRoute path="/inspect/:ref" component={RequestInspectorPage} />
              <ProtectedRoute path="/userManagement" permission="ADMIN" component={UserManagementPage} />
            </Container>
            {/* // TODO Notfound page */}
          </Switch>
        </Router>
      </React.Fragment>
    </UserContext.Provider>
  )
}