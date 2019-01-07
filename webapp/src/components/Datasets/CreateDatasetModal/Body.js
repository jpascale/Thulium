/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { ModalBody } from 'reactstrap';
import PickType from './Stages/PickType';
import UploadDatasets from './Stages/UploadDatasets';
import ReviewDatasets from './Stages/ReviewDatasets';

const Body = ({ stage, nextStage, closeModal }) => {

	const Component = (() => {
		if (stage === 'pick-type') return PickType;
		if (stage === 'upload-datasets') return UploadDatasets;
		if (stage === 'review-datasets') return ReviewDatasets;
		return PickType;
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