import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem, NavLink, Form, FormGroup, Input, Label, Nav } from 'reactstrap';

import { closeCreateFileModal, createFile } from '../../actions/files';

class CreateFileModal extends React.Component {

	state = {
		engine: '',
		filename: '',
		dataset: '',
	}

	handleChange = key => e => this.setState({ [key]: e.target.value })
	closeModal = () => this.props.closeCreateFileModal()

	createFile = () => {
		const { createFile } = this.props;
		const { filename, dataset, engine } = this.state;
		createFile({ filename, dataset, engine }).then(() => {
			this.closeModal();
		}, err => {
			console.error(err);
		});
	}

	render = () => {
		const { modal, creatingFile, engines, datasets } = this.props;
		const { filename, engine, dataset } = this.state;
		return (
			<Modal isOpen={modal}>
				<ModalHeader>Create New File</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Label>Filename</Label>
							<Input placeholder="Filename" value={filename} onChange={this.handleChange('filename')} />
						</FormGroup>
						<FormGroup>
							<Label>Engine</Label>
							<Input type="select" value={engine} onChange={this.handleChange('engine')}>
								<option value={''}>Select Engine</option>
								{Object.values(engines).map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label>Dataset</Label>
							<Input type="select" value={dataset} onChange={this.handleChange('dataset')}>
								<option value={''}>Select Dataset</option>
								{Object.values(datasets).filter(v => !v.full && !v.exam).map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
							</Input>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.createFile} disabled={!filename || creatingFile || !dataset || !engine}>
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
	creatingFile: state.app.creatingFile,
	engines: state.app.engines,
	datasets: state.app.datasets
});

const mapDispatchToProps = dispatch => ({
	closeCreateFileModal: () => dispatch(closeCreateFileModal()),
	createFile: filename => dispatch(createFile(filename))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFileModal);