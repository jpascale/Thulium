import React from 'react';
import { connect } from 'react-redux';

const QueryError = ({ error }) => {
	if (!error) return null;
	if (error.displayMessage) {
		return <span className="query-error-text">{error.displayMessage}</span>
	}
	return <pre>{JSON.stringify(error, null, 2)}</pre>
};

const mapStateToProps = state => ({
	error: state.app.error,
})

export default connect(mapStateToProps)(QueryError);
