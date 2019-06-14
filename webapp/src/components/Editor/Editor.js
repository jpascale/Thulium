import React from 'react';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';
import debounce from 'lodash.debounce';
import TaskDrawer from './TaskDrawer';

import 'brace/mode/sql';
import 'brace/theme/monokai';

import { autosave } from '../../actions/files';
import { changeText } from '../../actions/editor';

class Editor extends React.Component {

	constructor(props) {
		super(props);

		this.autosave = debounce(this.autosave, 2000);
		this.props.changeText(props.file.content)
	}

	componentDidUpdate = ({ file: prevFile }) => {
		const { file } = this.props;
		if (prevFile.content !== file.content) {
			this.props.changeText(file.content);
		}
	}

	autosave = () => {
		const { autosave, queryText } = this.props;
		autosave(queryText);
	}

	onLoad = () => {

	}

	onChange = (value, diff) => {
		// const { autosave } = this.props;
		this.props.changeText(value);
		this.autosave(value);
	}

	render = () => {
		const { queryText, file } = this.props;

		return (
			<div style={{position:'relative'}}>
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
					<TaskDrawer />
				</div>
		);
	}
}

const mapStateToProps = state => ({
	file: state.app.files[state.app.selectedFile],
	queryText: state.app.currentText,
});

const mapDispatchToProps = dispatch => ({
	autosave: sql => dispatch(autosave(sql)),
	changeText: sql => dispatch(changeText(sql))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);