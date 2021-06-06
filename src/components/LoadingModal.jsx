import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import LoadingComponent from './LoadingComponent'
export default class LoadingModal extends Component {

  render() {
    return (
      <Modal
        show={this.props.show}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <LoadingComponent/>
        </Modal.Body>
      </Modal>
    )
  }

}