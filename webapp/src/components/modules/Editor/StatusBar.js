import React from 'react';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class StatusBar extends React.Component {
	render() {
		return (
			<Navbar color="dark" expand="md" className="navbar-dark editor-action-bar">
				<Nav className="mr-auto" navbar>
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

export default StatusBar;