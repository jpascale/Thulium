import React from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';

const range = (n, b = 0) => new Array(n).fill(undefined).map((_, i) => i + b);

class Results extends React.Component {

	rowGetter = (i) => this.props.records[i]

	render() {
		const { columns, recordCount } = this.props;
		const dataGridColumns = columns.map(c => ({
			key: c,
			name: c
		}));
		return (
			<ReactDataGrid
        columns={dataGridColumns}
        rowGetter={this.rowGetter}
        rowsCount={recordCount}
        minHeight={500} />
		);
	}
}

const mapStateToProps = state => ({
	columns: state.app.results ? state.app.results.columns : [],
	records: state.app.results ? state.app.results.records : [],
	recordCount: state.app.results ? state.app.results.count : 0
})

export default connect(mapStateToProps)(Results);