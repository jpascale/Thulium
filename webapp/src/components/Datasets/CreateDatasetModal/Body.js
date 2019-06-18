/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalBody } from 'reactstrap';
import PickParadigm from './Stages/PickParadigm';
import UploadDatasets from './Stages/UploadDatasets';
import ReviewDatasets from './Stages/ReviewDatasets';
import ReviewActions from './Stages/ReviewActions';

const Body = ({ stage, nextStage, closeModal }) => {

	const Component = (() => {
		if (stage === 'pick-paradigm') return PickParadigm;
		if (stage === 'upload-datasets') return UploadDatasets;
		if (stage === 'review-datasets') return ReviewDatasets;
		if (stage === 'review-actions') return ReviewActions;
		return PickParadigm;
	})();

	return (
		<ModalBody>
			<Component />
		</ModalBody>
	)
};

const mapStateToProps = state => ({
	stage: state.dataset.create.stage
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Body);