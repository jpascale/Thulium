import React from 'react';

import SidebarContent from '../modules/Sidebar/SidebarContent';

import '../../styles/sidebar.scss';

const Sidebar = props => (
	<nav className="col-md-2 d-none d-md-block bg-light sidebar">
		<div className="sidebar-sticky">
			<SidebarContent />
		</div>
	</nav>
);

export default Sidebar;