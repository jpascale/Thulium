/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button } from 'reactstrap';
import classNames from 'classnames';

import { nextStage, prevStage, createDataset } from '../../../actions/datasets';

const Footer = ({ stage, prevStage, nextStage, createDataset, closeModal, ok }) => {

	if (stage === 'pick-paradigm') {
		return (
			<ModalFooter>
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" onClick={nextStage}>Next Step</Button>
			</ModalFooter>
		);
	}

	if (stage === 'upload-datasets') {
		return (
			<ModalFooter>
				<Button color="link" className="back-button" onClick={prevStage}>Go Back</Button>{' '}
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" disabled={!ok} onClick={nextStage}>Next Step</Button>
			</ModalFooter>
		);
	}

	if (stage === 'review-datasets') {
		return (
			<ModalFooter>
				<Button color="link" className="back-button" onClick={prevStage}>Go Back</Button>{' '}
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" disabled={!ok} onClick={nextStage}>Next step</Button>
			</ModalFooter>
		);
	}

	if (stage === 'review-actions') {
		return (
			<ModalFooter>
				<Button color="link" className="back-button" onClick={prevStage}>Go Back</Button>{' '}
				<Button color="secondary" onClick={closeModal}>Cancel</Button>{' '}
				<Button color="primary" disabled={!ok} onClick={createDataset}>Submit</Button>
			</ModalFooter>
		);
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
	createDataset: () => dispatch(createDataset()),
	nextStage: () => dispatch(nextStage()),
	prevStage: () => dispatch(prevStage())
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);