import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem, NavLink, Form, FormGroup, Input, Label, Nav } from 'reactstrap';

import '../../styles/navbar.scss';

import { login, logout } from '../../actions/auth';
import { upload } from '../../actions/upload_file';
import CSVReader from "react-csv-reader";

class ThuliumCreateDataset extends React.Component {

  state = {}

  handleFileChange = data => this.setState({ data })

  displayLoginModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  handleUpload = () => {
    const { handleUpload } = this.props;
    const { data } = this.state;
    handleUpload(data).then(() => {
      this.closeModal();
    }, err => {
      console.error(err);
    });
  }

  logout = () => this.props.logout()

  render = () => {
    const { profile, loggingIn } = this.props;
    const { modal } = this.state;
    const createDataset = (
      <NavItem>
        <NavLink href="#" onClick={this.displayLoginModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          CREATE DATASET
        </NavLink>
      </NavItem>
    );

    return (
      <React.Fragment>
        <Nav>
          {profile.role !== 'anonymous' && createDataset}
        </Nav>
        <Modal isOpen={modal}>
          <ModalHeader>Create dataset</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <CSVReader
                  cssClass="react-csv-input"
                  label="Select CSV with secret Death Star statistics"
                  onFileLoaded={this.handleFileChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleUpload} disabled={loggingIn}>{loggingIn ? 'Uploading' : 'Upload'}</Button>{' '}
            <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    profile: state.auth.profile,
    loggingIn: state.auth.loggingIn
  }
};

const mapDispatchToProps = dispatch => ({
  handleUpload: data => dispatch(upload(data)),
  login: form => dispatch(login(form)),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(ThuliumCreateDataset);