import React from 'react';


import TabBar from '../Editor/TabBar';
import Tab from '../Editor/Tab';

import '../../styles/main.scss';

const Main = props => (
	<React.Fragment>
		<TabBar />
		<main role="main" id="main-container" className="col-md-9 ml-sm-auto col-lg-10 full-height">
			<Tab />
		</main>
	</React.Fragment>
);

export default Main;