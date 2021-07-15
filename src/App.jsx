import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from 'react-bootstrap'
import NavigationBar from './components/NavigationBar'
import RequestTemplatesPage from './pages/RequestTemplatesPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestsPage from './pages/RequestsPage'
import RequestPage from "./pages/RequestPage";
import RequestInspectorPage from './pages/RequestInspectorPage'
import CustomRequestPage from './pages/CustomRequestPage'
import RequestTemplateEditorPage from './pages/RequestTemplateEditorPage'
import UserManagementPage from "./pages/UserManagementPage";
import NotFoundPage from "./pages/NotFoundPage"
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

  return (
    <UserContext.Provider value={{ user: user, isLoggedIn: false }}>
      <React.Fragment>
        <Router>
          {user && <NavigationBar user={user} handleLogout={handleLogout} />}
          <Container>
            <Switch>
              <Route path="/login" component={() => <LoginPage handleLogin={handleLogin} />} />
              <ProtectedRoute exact path="/" component={RequestTemplatesPage} />
              <ProtectedRoute path="/editTemplate/:uuid" component={RequestTemplateEditorPage} />
              <ProtectedRoute path="/request/:uuid" component={RequestPage} />
              <ProtectedRoute path="/createTemplate" component={RequestTemplateEditorPage} />
              <ProtectedRoute path="/customRequest" component={CustomRequestPage} />
              <ProtectedRoute path="/myRequests" component={MyRequestsPage} />
              <ProtectedRoute path="/AllRequests" component={RequestsPage} />
              <ProtectedRoute path="/inspect/:ref" component={RequestInspectorPage} />
              <ProtectedRoute path="/userManagement" permission="ADMIN" component={UserManagementPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Container>
        </Router>
      </React.Fragment>
    </UserContext.Provider>
  )
}