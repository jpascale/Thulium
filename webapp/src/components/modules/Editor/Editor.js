import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/sql';
import 'brace/theme/monokai';


class Editor extends React.Component {

	onLoad = () => {

	}

	onChange = () => {

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
			showPrintMargin={true}
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

export default Editor;