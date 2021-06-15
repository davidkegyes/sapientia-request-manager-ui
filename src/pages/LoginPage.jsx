import React, { useState } from "react";
import Jumbotron from 'react-bootstrap/Jumbotron'
import GoogleLogin from 'react-google-login';
import AuthorizationService from '../services/AuthorizationService'
import UserService from '../services/UserService'
import { Container, Row, Col, Alert, Form } from "react-bootstrap";
import LoadingModal from '../components/LoadingModal'
import './LoginPage.css';
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import logo from '../assets/logo_hu.png'
import { useTranslation } from 'react-i18next';
import LanguageSelectorComponent from "../components/LanguageSelectorComponent";

export default function LoginPage(props) {

    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const { t } = useTranslation();

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
        let refreshTiming = (res.tokenObj.expires_in || 3599) * 1000;
        console.log("refreshToken");
        const refreshToken = async () => {
            const newAuthRes = await res.reloadAuthResponse();
            refreshTiming = (newAuthRes.expires_in || 3599) * 1000;
            AuthorizationService.storeToken(newAuthRes.id_token);
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
        <Container className="box">
            <Row >
                <Col className="d-flex align-items-center justify-content-center">
                    <img src={logo} className="loginLogo" title="Sapientia EMTE" alt="Sapientia EMTE" />
                </Col>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center">
                    <p>{t("page.login.hint")}</p>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center">
                    <p>
                        <GoogleLogin
                            clientId="746309681103-5jb4g12c5kn08olp6j5ck7v5bm9630ve.apps.googleusercontent.com"
                            buttonText={t("page.login.button")}
                            onSuccess={succesResponseGoogle}
                            onFailure={errorResponseGoogle}
                            cookiePolicy={'single_host_origin'}
                        // autoLoad={true}
                        // isSignedIn={true}
                        />
                    </p>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center"><LanguageSelectorComponent /></Col>
            </Row>
            { error !== undefined &&
                <Row>
                    <Col className="d-flex align-items-center justify-content-center">
                        <Alert key={error} variant='danger'>{error}</Alert>
                    </Col>
                </Row>}
            <LoadingModal show={loading} />
        </Container>
    )
}