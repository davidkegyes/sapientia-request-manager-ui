import React, {useContext} from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_hu.png'
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { GoogleLogout } from 'react-google-login';
import LanguageSelectorComponent from './LanguageSelectorComponent'
import Restricted from './Restricted';
import { UserContext } from '../App';
const Styles = styled.div`
  .navbar {
    margin-bottom: 15px;
    background: #FFFFFF !important;
    -webkit-box-shadow: 0px 3px 7px -1px rgb(0 0 0 / 48%);
    -moz-box-shadow: 0px 3px 7px -1px rgba(0,0,0,0.48);
    box-shadow: 0px 3px 7px -1px rgb(0 0 0 / 48%);
  }
  a, .navbar-brand, .navbar-nav .nav-link {
    color: #000;
    &:hover {
      color: #166b42;
    }
    &.active {
        border-bottom: 3px solid #156a41;
    }    
  }

  a, .navbar-brand {
      padding: 0px;
  }

  img, .navbar-brand {
      height:80px;
  }
`;
export default function NavigationBar({ handleLogout }) {

    const userCtxt = useContext(UserContext);
    const { t } = useTranslation();

    return (
        <Styles>
            <Navbar expand="md">
                <Container>
                    <Navbar.Brand href="/">
                        <img src={logo} className="logo" title="Sapientia EMTE" alt="Sapientia EMTE" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <Nav.Link as={NavLink} exact to="/">{t("page.requestTemplates.title")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={NavLink} to="/myRequests">{t("page.myRequests.title")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={NavLink} to="/customRequest">{t("page.customRequest.title")}</Nav.Link>
                            </Nav.Item>
                            <Restricted permission="ADMIN">
                                <Nav.Item>
                                    <Nav.Link as={NavLink} to="/templateEditor">{t("page.requesTemplateEditor.title")}</Nav.Link>
                                </Nav.Item>
                            </Restricted>
                            <Restricted permission="ADMIN">
                                <Nav.Item>
                                    <Nav.Link as={NavLink} to="/userManagement">UserManagement</Nav.Link>
                                </Nav.Item>
                            </Restricted>
                        </Nav>
                        {userCtxt.name}
                        <LanguageSelectorComponent />
                        <GoogleLogout
                            clientId="746309681103-5jb4g12c5kn08olp6j5ck7v5bm9630ve.apps.googleusercontent.com"
                            buttonText={t("component.navbar.logoutButton")}
                            onLogoutSuccess={handleLogout}
                        >
                        </GoogleLogout>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Styles>
    );
}