import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import LoadingComponent from './LoadingComponent'
export default function LoadingModal( {show}) {

  return (
    <Modal
      show={show}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <LoadingComponent />
      </Modal.Body>
    </Modal>
  )

}