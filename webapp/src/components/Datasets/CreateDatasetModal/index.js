/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup } from 'reactstrap';

import { upload } from '../../../actions/datasets';
import CSVReader from 'react-csv-reader';

import Header from './Header'

import './DatasetModal.scss';
import PickType from './PickType';


class CreateDatasetModal extends React.Component {

  state = {
    stage: 'pick-type'
  }

  handleFileChange = data => this.setState({ data })
  handleUpload = () => {
    const { handleUpload } = this.props;
    const { data } = this.state;
    handleUpload(data).then(() => {
      this.closeModal();
    }, err => {
      console.error(err);
    });
  }

  nextStep = () => {

  }

  render = () => {


    return (
      <Modal isOpen={true} className="create-dataset-modal">
        <Header toggle={this.props.closeModal} />
        <ModalBody>
          <PickType />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.nextStep}>Next Step</Button>{' '}
          <Button color="secondary" onClick={this.props.closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <Modal isOpen={true} className="create-dataset-modal">
        <Header />
        <ModalBody>
          <Form>
            <FormGroup>
              <CSVReader
                cssClass="react-csv-input"
                label="Select CSV"
                onFileLoaded={this.handleFileChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.nextStep}>Upload</Button>{' '}
          <Button color="secondary" onClick={this.props.closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.auth.profile,
  loggingIn: state.auth.loggingIn
});

const mapDispatchToProps = dispatch => ({
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDatasetModal);