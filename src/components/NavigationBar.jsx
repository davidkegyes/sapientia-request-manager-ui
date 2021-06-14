import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import logo from '../assets/logo_hu.png'
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { GoogleLogout } from 'react-google-login';

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
export default function NavigationBar( {handleLogout}) {

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
                                <Nav.Link as={NavLink} exact to="/">{t("nav.requestTemplates")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={NavLink} to="/myRequests">{t("nav.myRequests")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <GoogleLogout
                            clientId="746309681103-5jb4g12c5kn08olp6j5ck7v5bm9630ve.apps.googleusercontent.com"
                            buttonText={t("nav.logout")}
                            onLogoutSuccess={handleLogout}
                        >
                        </GoogleLogout>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Styles>
    );
}