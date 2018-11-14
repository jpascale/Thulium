import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem, NavLink, Form, FormGroup, Input, Label, Nav } from 'reactstrap';

import { closeCreateFileModal, createFile } from '../../../actions/files';

class CreateFileModal extends React.Component {

	state = {}

	handleChange = key => e => this.setState({ [key]: e.target.value })
	closeModal = () => this.props.closeCreateFileModal()

	createFile = () => {
		const { createFile } = this.props;
		const { filename } = this.state;
		createFile(filename).then(() => {
			this.closeModal();
		}, err => {
			console.error(err);
		});
	}

	render = () => {
		const { modal, creatingFile } = this.props;
		const { filename } = this.state;
		return (
			<Modal isOpen={modal}>
				<ModalHeader>Create New File</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label>Filename</Label>
							<Input placeholder="Filename" onChange={this.handleChange('filename')} />
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.createFile} disabled={!filename || creatingFile}>
						{creatingFile ? 'Creating' : 'Create'}
					</Button>
					{' '}
					<Button color="secondary" onClick={this.closeModal}>Cancel</Button>
				</ModalFooter>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	modal: state.app.createFileModal,
	creatingFile: state.app.creatingFile
});

const mapDispatchToProps = dispatch => ({
	closeCreateFileModal: () => dispatch(closeCreateFileModal()),
	createFile: filename => dispatch(createFile(filename))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFileModal);