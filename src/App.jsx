import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from './components/NavigationBar'
import RequestTemplatesPage from './pages/RequestTemplatesPage'
import AdminPage from './pages/AdminPage'
import RequestPDFService from './services/RequestPDFService'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestInspectorPage from './pages/RequestInspectorPage'
import './App.css'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.requestPDFService = new RequestPDFService();
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {};
  }

  handleLogin(user) {
    this.setState({ user: user });
  }

  handleLogout() {
    localStorage.clear();
    this.setState({ user: undefined });
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          {this.state.user && <NavigationBar />}
          <Switch>
            <Route path="/login" component={() => <LoginPage user={this.state.user} handleLogin={this.handleLogin} />} />
            <ProtectedRoute exact path="/" user={this.state.user} component={RequestTemplatesPage} />
            <ProtectedRoute path="/adminPage" user={this.state.user} component={AdminPage} />
            <ProtectedRoute path="/myRequests" user={this.state.user} component={MyRequestsPage} />
            <ProtectedRoute path="/inspect/:ref" user={this.state.user} component={RequestInspectorPage} />
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}