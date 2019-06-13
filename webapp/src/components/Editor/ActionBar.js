import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import { run } from '../../actions/app';
import { toggleTask } from '../../actions/editor';

class ActionBar extends React.Component {

	onRun = () => {
		console.log('onRun');
		this.props.run();
	}

	render() {
		const { running, toggleTask, showTask, examMode } = this.props;
		// const 
		return (
			<Navbar color="dark" expand="md" className="navbar-dark editor-action-bar">
				<Nav className="mr-auto" navbar>
					<NavItem>
						<NavLink href="#" onClick={this.onRun} className="editor-action-bar-button">{running ? "Running" : "Run"}</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Stop</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Explain</NavLink>
					</NavItem>
				</Nav>
				{examMode && (
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href="#" onClick={toggleTask} className="editor-action-bar-button">{showTask ? 'Hide' : 'Show'} Task</NavLink>
						</NavItem>
					</Nav>
				)}
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	running: state.app.running,
	showTask: state.app.showTask,
	examMode: state.app.examMode
});
const mapDispatchToProps = dispatch => ({
	run: () => dispatch(run()),
	toggleTask: () => dispatch(toggleTask())
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);