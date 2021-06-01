import React, { useState } from "react";
import Jumbotron from 'react-bootstrap/Jumbotron'
import GoogleLogin from 'react-google-login';
import AuthorizationService from '../services/AuthorizationService'
import UserService from '../services/UserService'
import { Container, Row, Col, Alert } from "react-bootstrap";
import LoadingModal from '../components/LoadingModal'
import './LoginPage.css';
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function LoginPage(props) {

    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    if (props.user) {
        return <Redirect to={
            {
              pathname: history.location.state.from.pathname,
              state: {
                from: props.location
              }
            }
          } />
    }

    let token = localStorage.getItem('token');
    if (token) {
        // setLoading(true);
        UserService.getUserDetails()
            .then((user) => {
                props.handleLogin(user);
            }).catch((error) => {
                localStorage.removeItem('token');
                setLoading(false);
            });
    }

    function refreshTokenSetup(res) {
        // Timing to renew access token
        let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
        console.log(refreshTiming,res);
        const refreshToken = async () => {
            const newAuthRes = await res.reloadAuthResponse();
            refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
            console.log('newAuthRes:', newAuthRes);
            AuthorizationService.storeUserAndToken(newAuthRes.id_token);
            setTimeout(refreshToken, refreshTiming);
        };
        setTimeout(refreshToken, refreshTiming);
    };

    function succesResponseGoogle(res) {
        console.log("succesResponseGoogle");
        AuthorizationService.storeToken(res.tokenId);
        refreshTokenSetup(res);
        checkGoogleTokenAgainstBE();
    }

    function errorResponseGoogle(res) {
        console.log("errorResponseGoogle");
        console.log(res);
    }

    function checkGoogleTokenAgainstBE() {
        UserService.getUserDetails()
            .then((user) => {
                props.handleLogin(user);
            }).catch((error) => {
                console.log(error);
                localStorage.removeItem('token');
                setError(error.message);
                setLoading(false);
            });
    }

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <Jumbotron>
                        <h1>Sapientia Application Manager</h1>
                        <p>
                            Aenean velit ipsum, tempus eget enim sit amet, vestibulum volutpat dolor. Nulla at nunc placerat, fermentum ante a, euismod neque. Aenean fermentum felis et augue pretium eleifend. Suspendisse potenti.
                            </p>
                        <p>
                            <GoogleLogin
                                clientId="746309681103-5jb4g12c5kn08olp6j5ck7v5bm9630ve.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={succesResponseGoogle}
                                onFailure={errorResponseGoogle}
                                cookiePolicy={'single_host_origin'}
                            // autoLoad={true}
                            // isSignedIn={true}
                            />
                        </p>
                    </Jumbotron>
                </Col>
            </Row>
            { error !== undefined &&
                <Row>
                    <Col>
                        <Alert key={error} variant='danger'>{error}</Alert>
                    </Col>
                </Row>}
            <LoadingModal show={loading} />
        </Container>
    )
}