import React from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';
import debounce from 'lodash.debounce';

import 'brace/mode/sql';
import 'brace/theme/monokai';

import { autosave } from '../../../actions/files';

class Editor extends React.Component {

	constructor(props) {
		super(props);

		this.autosave = debounce(this.autosave, 400);
		this.state = { queryText: props.file.content };
	}

	componentDidUpdate = ({ file: prevFile }) => {
		const { file } = this.props;
		if (prevFile !== file) {
			this.setState({ queryText: file.content });
		}
	}

	autosave = () => {
		const { autosave } = this.props;
		const { queryText } = this.state;
		autosave(queryText);
	}

	onLoad = () => {

	}

	onChange = (value, diff) => {
		this.setState({ queryText: value });
		this.autosave();
	}

	render = () => {
		const { queryText } = this.state;

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
				value={queryText}
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

const mapStateToProps = state => ({
	file: state.app.files[state.app.selectedFile],
});

const mapDispatchToProps = dispatch => ({
	autosave: sql => dispatch(autosave(sql))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);