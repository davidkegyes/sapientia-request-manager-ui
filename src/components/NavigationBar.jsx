import { Component } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_hu.png'
import styled from 'styled-components';

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
export default class Header extends Component {

    render() {
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
                                <Nav.Link as={NavLink} exact to="/">Kérvények</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={NavLink} to="/myRequests">Saját kérvények</Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                                <Nav.Link as={NavLink} to="/adminPage">Admin</Nav.Link>
                            </Nav.Item> */}
                            {/* <Nav.Item>
                                <Button onClick={this.props.handleLogout}>Logout</Button>
                            </Nav.Item> */}
                        </Nav>
                    </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Styles>
        );
    }

}