import React from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';
import debounce from 'lodash.debounce';

import 'brace/mode/sql';
import 'brace/theme/monokai';

import { run, queryChanged } from '../../../actions/app';

class Editor extends React.Component {

	constructor(props) {
		super(props);

		this.onChange = debounce(this.onChange, 400);
	}

	onLoad = () => {

	}

	onChange = (value, diff) => {
		this.props.queryChanged(value);
	}

	render() {
		return (
			<AceEditor
			mode="sql"
			theme="monokai"
			name="blah2"
			onLoad={this.onLoad}
			onChange={this.onChange}
			fontSize={14}
			showPrintMargin={false}
			showGutter={true}
			highlightActiveLine={true}
			width="100%"
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: false,
				showLineNumbers: true,
				tabSize: 2,
			}} />
		);
	}
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
	queryChanged: sql => dispatch(queryChanged(sql))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);