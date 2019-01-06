import React from 'react';
import Loadable from 'react-loadable';

import ActionBar from './ActionBar';
import StatusBar from './StatusBar';
import Editor from './Editor';

const AsyncResults = Loadable({
  loader: () => import(/* webpackChunkName: "Results" */ './Results'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

class Tab extends React.Component {
	render() {
		return (
			<div className="thulium-tab">
				<ActionBar />
				<Editor />
				<StatusBar />
				<AsyncResults />
			</div>
		);
	}
}

export default Tab;