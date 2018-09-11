import React from 'react';

import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

class ActionBar extends React.Component {
	render() {
		return (
			<Navbar color="dark" expand="md" fixed="top" className="navbar-dark editor-action-bar">
				<Nav className="mr-auto" navbar>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Run</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Stop</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" className="editor-action-bar-button">Explain</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

export default ActionBar;