import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar'
import RequestTemplatesPage from './pages/RequestTemplatesPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestInspectorPage from './pages/RequestInspectorPage'
import CustomRequestPage from './pages/CustomRequestPage'
import RequestTemplateEditorPage from './pages/RequestTemplateEditorPage'
import './App.css'
import { useTranslation } from 'react-i18next';


export default function App() {

  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(()=>{
    document.title = t("title")
  }, [i18n]);

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  }

  return (
      <React.Fragment>
        <Router>
          {user && <NavigationBar handleLogout={handleLogout}/>}
          {/* <NavigationBar handleLogout={handleLogout}/> */}
          <Switch>
            <Route path="/login" component={() => <LoginPage user={user} handleLogin={handleLogin} />} />
            <ProtectedRoute exact path="/" user={user} component={RequestTemplatesPage} />
            <ProtectedRoute path="/createRequestTemplate" user={user} component={RequestTemplateEditorPage} />
            <ProtectedRoute path="/customRequest" user={user} component={CustomRequestPage} />
            <ProtectedRoute path="/myRequests" user={user} component={MyRequestsPage} />
            <ProtectedRoute path="/inspect/:ref" user={user} component={RequestInspectorPage} />
            {/* // TODO Notfound page */}
          </Switch>
        </Router>
      </React.Fragment>
  )
}