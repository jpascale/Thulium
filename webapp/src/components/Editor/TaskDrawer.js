import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';

import { changeResponse } from '../../actions/files';
import { submitExamResponse } from '../../actions/exams';

const range = (n, b = 0, fn = v => v) => Array.from({ length: n}).map((_, i) => fn(i + b))

class TaskDrawer extends React.Component {

	state = {}

	handleChange = key => e => this.setState({ [key]: e.target.value })

	changeResponse = e => {
		this.props.changeResponse(this.props.file._id, e.target.value)
	}

	render = () => {
		const { showTask, file, submitExamResponse } = this.props;

		const responseComponent = (() => {
			if (file.type === 'true-false') {
				return (
					<Input type="select" value={file.response} onChange={this.changeResponse}>
						<option value="">Select True/False</option>
						<option value="false">False</option>
						<option value="true">True</option>
					</Input>
				);
			}
			if (file.type === 'multiple-choice') {
				return (
					<Input type="select" value={file.response} onChange={this.changeResponse}>
						<option value="">Select your answer</option>
						{range(file.options.total, 0, i => (
							<option key={i} value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
						))}
					</Input>
				);
			}
			if (file.type === 'written-answer') {
				return <Input type="textarea" value={file.response} placeholder="Write your answer here" onChange={this.changeResponse} />
			}
			if (file.type === 'query-response') {
				return <i className="text-muted">Your answer will be the query you write in the editor</i>
			}
			return null;
		})();

		const disabled = (() => {
			if (file.type === 'true-false') return !file.response;
			if (file.type === 'multiple-choice') return !file.response;
			if (file.type === 'written-answer') return !file.response;
			if (file.type === 'query-response') return false;
			return false;
		})();

		return (
			<div className={`task bg-light ${showTask && 'open' }`}>
				<h3>{file.title}</h3>
				<p>{file.task}</p>
				<h5>Your Response</h5>
				<Form>
					<FormGroup>
						{responseComponent}
					</FormGroup>
				</Form>
				<Button disabled={disabled} onClick={submitExamResponse} color="success">Submit</Button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	file: state.app.files[state.app.selectedFile],
	showTask: state.app.showTask
});

const mapDispatchToProps = dispatch => ({
	changeResponse: (file, response) => dispatch(changeResponse(file, response)),
	submitExamResponse: () => dispatch(submitExamResponse())
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDrawer);