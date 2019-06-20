import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import ActionBar from './ActionBar';
import StatusBar from './StatusBar';
import Editor from './Editor';

const AsyncResults = Loadable({
  loader: () => import(/* webpackChunkName: "Results" */ './Results'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

const AsyncQueryError = Loadable({
  loader: () => import(/* webpackChunkName: "QueryError" */ './QueryError'),
  /* eslint-disable react/display-name */
  loading: () => <span>Loading</span>
});

const EditorTab = ({ results, error }) => (
	<div className="thulium-tab">
		<ActionBar />
		<Editor />
		<StatusBar />
		{results ? <AsyncResults /> : null}
		{error ? <AsyncQueryError /> : null}
	</div>
);

const mapStateToProps = state => ({
	results: state.app.results,
	error: state.app.error
});

export default connect(mapStateToProps)(EditorTab);