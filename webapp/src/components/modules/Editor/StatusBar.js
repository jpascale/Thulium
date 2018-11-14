import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class StatusBar extends React.Component {
	
	render = () => {
		const { autosaving } = this.props;

		const autosaveStatus = autosaving ? (
			<NavItem>
				<NavLink href="#" className="editor-action-bar-button">Autosaving...</NavLink>
			</NavItem>
		) : null;

		return (
			<Navbar color="dark" expand="md" className="navbar-dark editor-action-bar">
				<Nav className="mr-auto" navbar>
					{autosaveStatus}
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Run in 55ms</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">55 rows affected</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	autosaving: state.app.autosaving
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);