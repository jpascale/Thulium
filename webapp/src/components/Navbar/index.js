import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import EnginePicker from './EnginePicker';
import LoginModal from './LoginModal';

import './navbar.scss';

import { logout } from '../../actions/auth';

const ThuliumNavbar = props => (
	<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-navbar">
		<NavbarBrand href="#">Thulium</NavbarBrand>
		<Nav className="mr-auto" navbar>
			<EnginePicker />
		</Nav>
		<LoginModal />
	</Navbar>
);

export default ThuliumNavbar;