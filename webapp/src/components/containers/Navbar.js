import React from 'react';
import { Navbar, NavbarBrand, Nav } from 'reactstrap';

import EnginePicker from '../modules/Navbar/EnginePicker';

import '../../styles/navbar.scss';

const ThuliumNavbar = props => (
	<Navbar color="dark" expand="md" fixed="top" className="navbar-dark thulium-navbar">
		<NavbarBrand href="#">Thulium</NavbarBrand>
		<Nav className="ml-auto" navbar>
			<EnginePicker />
		</Nav>
	</Navbar>
);

export default ThuliumNavbar;