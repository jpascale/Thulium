/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';

import Header from './Header'

import './DatasetModal.scss';
import Footer from './Footer';
import Body from './Body';

const CreateDatasetModal = ({ closeModal }) => (
  <Modal isOpen={true} className="create-dataset-modal">
    <Header toggle={closeModal} />
    <Body />
    <Footer closeModal={closeModal} />
  </Modal>
);

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDatasetModal);