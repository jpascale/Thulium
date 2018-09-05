import React from 'react';

import ActionBar from '../modules/Editor/ActionBar';

import '../../styles/main.scss';

const Main = props => (
	<main role="main" className="col-md-9 ml-sm-auto col-lg-10">
		<ActionBar />
		<h1>Hola</h1>
	</main>
);

export default Main;