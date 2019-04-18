/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button } from 'reactstrap';
import classNames from 'classnames';

import { nextStage } from '../../../actions/datasets';

const Footer = ({ stage, nextStage, closeModal, ok }) => {

	if (stage === 'pick-type') {
		return (
			<ModalFooter>
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" onClick={nextStage}>Next Step</Button>
			</ModalFooter>
		)
	}

	if (stage === 'upload-datasets') {
		return (
			<ModalFooter>
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" disabled={!ok} onClick={nextStage}>Next Step</Button>
			</ModalFooter>
		)
	}

	return null;
};

const mapStateToProps = state => ({
	stage: state.dataset.create.stage,
	ok: ((items) => {
		if (!items.length) return false;
		return !items.filter(i => i.error || !i.data || !i.data.length).length
	})(state.dataset.create.items),
	
});

const mapDispatchToProps = dispatch => ({
	nextStage: () => dispatch(nextStage())
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);