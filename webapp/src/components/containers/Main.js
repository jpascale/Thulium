import React from 'react';

import ActionBar from '../modules/Editor/ActionBar';
import Editor from '../modules/Editor/Editor';
import Results from '../modules/Editor/Results';

import '../../styles/main.scss';

const Main = props => (
	<main role="main" id="main-container" className="col-md-9 ml-sm-auto col-lg-10">
		<ActionBar />
		<Editor />
		<Results />
	</main>
);

export default Main;