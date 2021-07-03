import React, { useState, useContext, useEffect } from "react";
import GoogleLogin from 'react-google-login';
import AuthorizationService from '../services/AuthorizationService'
import { getUserDetails } from '../services/UserService'
import { Container, Row, Col, Alert } from "react-bootstrap";
import LoadingModal from '../components/LoadingModal'
import './LoginPage.css';
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import logo from '../assets/logo_hu.png'
import { useTranslation } from 'react-i18next';
import LanguageSelectorComponent from "../components/LanguageSelectorComponent";
import { UserContext } from "../App";

export default function LoginPage(props) {

    const userContext = useContext(UserContext);
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const { t } = useTranslation();

    const checkUser = async () => {
        // if (localStorage.getItem('token')) {
            getUserDetails()
                .then((user) => {
                    props.handleLogin(user);
                }).catch((error) => {
                    // localStorage.clear();
                    // sessionStorage.clear();
                    console.log(error);
                    if (error.message === 'Network Error'){
                        setError("Kommunikacios problema, a bejelentkezes nem lehetseges");
                    }else if (error.response && error.response.status === 403) {
                        setError("Sajnos nincs hozzaferese");
                    } else {
                        setError("Hiba tortent, a bejelentkezes nem lehetseges");
                    }
                    setLoading(false);
                });
        // } else {
            // setLoading(false);
        // }
    }


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkUser();
        }
    }, []);

    if (userContext.user !== null) {
        return <Redirect to={
            {
                pathname: history.location.state ? history.location.state.from.pathname : '',
                state: {
                    from: props.location
                }
            }
        } />
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
        // setLoading(true);
        checkUser();
    }

    function errorResponseGoogle(res) {
        console.log("errorResponseGoogle");
        console.log(res);
    }

    if (localStorage.getItem('token')) {
        return (<LoadingModal show={true} />)
    }

    return (
        <Container className="box">
            <LoadingModal show={loading} />
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
                        />
                    </p>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center"><LanguageSelectorComponent /></Col>
            </Row>
            {error !== undefined &&
                <Row>
                    <Col className="d-flex align-items-center justify-content-center">
                        <Alert key={error} variant='danger'>{error}</Alert>
                    </Col>
                </Row>}
        </Container>
    )
}