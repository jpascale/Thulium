import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class StatusBar extends React.Component {
	
	render = () => {
		const { autosaving, results } = this.props;

		const autosaveStatus = autosaving ? (
			<NavItem>
				<NavLink href="#" className="editor-action-bar-button">Autosaving...</NavLink>
			</NavItem>
		) : null;

		return (
			<Navbar color="dark" expand="md" className="navbar-dark editor-action-bar">
				<Nav className="mr-auto" navbar>
					{autosaveStatus}
					{results && results.time ? (
						<React.Fragment>
							<NavItem>
								<NavLink href="#" className="editor-action-bar-button">Run in {results.time}ms</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="#" className="editor-action-bar-button">Showing {results.count} record{results.count === 1 ? '' : 's'}</NavLink>
							</NavItem>
						</React.Fragment>
					) : (
						<NavItem>
							<NavLink className="editor-action-bar-button">Type your query in the editor and hit Run</NavLink>
						</NavItem>
					)}
				</Nav>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	autosaving: state.app.autosaving,
	results: state.app.results
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);