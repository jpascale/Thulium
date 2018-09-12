import React from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'

import ActionBar from './ActionBar';
import StatusBar from './StatusBar';
import Editor from './Editor';
import Results from './Results';

class Tab extends React.Component {
	render() {
		return (
			<div className="thulium-tab">
				<ActionBar />
				<Editor />
				<StatusBar />
				<Results />
			</div>
		);
	}
}

export default Tab;