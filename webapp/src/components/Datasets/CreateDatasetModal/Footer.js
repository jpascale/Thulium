/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button } from 'reactstrap';
import classNames from 'classnames';

import { nextStage } from '../../../actions/datasets';

const Footer = ({ stage, nextStage, closeModal }) => {

	if (stage === 'pick-type' || stage === 'upload-datasets') {
		return (
			<ModalFooter>
				<Button color="primary" onClick={nextStage}>Next Step</Button>{' '}
				<Button color="secondary" onClick={closeModal}>Cancel</Button>
			</ModalFooter>
		)
	}

	return null;
};

const mapStateToProps = state => ({
	stage: state.dataset.create.stage
});

const mapDispatchToProps = dispatch => ({
	nextStage: () => dispatch(nextStage())
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);