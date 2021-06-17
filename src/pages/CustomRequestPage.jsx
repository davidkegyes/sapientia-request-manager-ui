import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import RequestService from "../services/RequestService";
import config from "../config";

export default function CustomRequestPage() {
  const { t } = useTranslation();
  const [requestFile, setRequestFile] = useState({ name: "", file: null });
  const [referenceNumber, setReferenceNumber] = useState(null);
  const [step, setStep] = useState(1);

  const onChange = (event) => {
    const { type, value, files } = event.target;
    let tmp = { ...requestFile };
    if (type === "text") {
      tmp.name = value;
    } else {
      tmp.file = files[0];
    }
    setRequestFile(tmp);
  };

  const validate = () => {
    let tmp = { ...requestFile };
    tmp.nameError = null;
    tmp.fileError = null;
    if (tmp.name === "") {
      tmp.nameError = t("page.customRequest.requestNameError");
    }
    if (tmp.file === null) {
      tmp.fileError = t("page.customRequest.noSelectedFileError");
    } else if (tmp.file.size / 1024 > config.rest.uploadFileSizeLimit) {
      tmp.fileError = t("page.customRequest.selectedFileSizeError", {
        sizeLimit: config.rest.uploadFileSizeLimit + " KB",
      });
    }
    return tmp;
  };

  const upload = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const validatedRequest = validate();
    if (
      validatedRequest.nameError === null &&
      validatedRequest.fileError === null
    ) {
      RequestService.uploadCustomRequest(requestFile.name, requestFile.file)
        .then((ref) => {
          setReferenceNumber(ref);
          setStep(2);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setRequestFile(validatedRequest);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>{t("page.customRequest.title")}</h1>
        </Col>
      </Row>
      {step === 1 && (
        <Row>
          <Col>
            {referenceNumber === null && (
              <Container fluid className="box">
                <Form noValidate onSubmit={upload}>
                  <Container fluid>
                    <Row>
                      <Col>
                        <p>{t("page.customRequest.description")}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>
                            {t("page.customRequest.requestName")}
                          </Form.Label>
                          <Form.Control
                            isInvalid={!!requestFile.nameError}
                            type="text"
                            value={requestFile.name}
                            onChange={onChange}
                            placeholder={t(
                              "page.customRequest.requestNamePlaceholder"
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("page.customRequest.requestNameError")}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.File custom>
                            <Form.File.Input
                              isInvalid={!!requestFile.fileError}
                              onChange={onChange}
                              accept=".jpg, .jpeg, .pdf"
                              multiple={false}
                            />
                            <Form.File.Label
                              data-browse={t("page.customRequest.browseFiles")}
                            >
                              {requestFile.file
                                ? requestFile.file.name
                                : t("page.customRequest.noSelectedFile")}
                            </Form.File.Label>
                            <Form.Control.Feedback type="invalid">
                              {requestFile.fileError}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                              {t("page.customRequest.requestFileInfo")}
                            </Form.Text>
                          </Form.File>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="rowSpace">
                      <Col className="d-flex justify-content-center align-items-center">
                        <Button type="submit">
                          {t("page.customRequest.uploadButton")}
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Form>
              </Container>
            )}
          </Col>
        </Row>
      )}
      {step === 2 && referenceNumber !== null && (
        <>
          <Row>
            <Col>
              <Alert variant="success">
                <Alert.Heading>
                  {t("request.requestUploadSuccessTitle")}
                </Alert.Heading>
                <p>{t("request.requestUploadSuccessMessage")}</p>
                <hr/>
                <NavLink to={"/inspect/" + referenceNumber} className='btn btn-outline-info ml-auto'>{t("request.navigateToRequestButton")}</NavLink>
              </Alert>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <h3>{t("page.customRequest.attachmentUploadTitle")}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <UploadComponent referenceNumber={referenceNumber} />
            </Col>
          </Row> */}
        </>
      )}
    </Container>
  );
}
