import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';

class TaskDrawer extends React.Component {

	state = {}

	handleChange = key => e => this.setState({ [key]: e.target.value })

	render = () => {
		const { showTask, file } = this.props;
		const { response } = this.state;

		const responseComponent = (() => {
			if (file.type === 'true-false') {
				return (
					<Input type="select" onChange={this.handleChange('response')}>
						<option value="">-- Select True/False</option>
						<option value="false">False</option>
						<option value="true">True</option>
					</Input>
				);
			}
			if (file.type === 'multiple-choice') {
				return null;
			}
			if (file.type === 'written-answer') {
				return <Input type="textarea" placeholder="Write your answer here" onChange={this.handleChange('response')} />
			}
			if (file.type === 'query-response') {
				return <i className="text-muted">Your answer will be the query you write in the editor</i>
			}
			return null;
		})();

		const disabled = (() => {
			if (file.type === 'true-false') return !response;
			if (file.type === 'multiple-choice') return !response;
			if (file.type === 'written-answer') return !response;
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
				<Button disabled={disabled} color="success">Submit</Button>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	file: state.app.files[state.app.selectedFile],
	showTask: state.app.showTask
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDrawer);