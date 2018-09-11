import React from 'react';
import ReactDataGrid from 'react-data-grid';

const range = (n, b = 0) => new Array(n).fill(undefined).map((_, i) => i + b);

class Results extends React.Component {

	constructor(props) {
		super(props);
		this._columns = [{
			key: 'id', name: 'ID'
		}, {
			key: 'title', name: 'Title'
		}, {
			key: 'count', name: 'Count'
		}];

		this._rows = range(100).map(i => ({
			id: i,
			title: `Fila ${i}`,
			count: Math.random() * i
		}));
	}

	rowGetter = (i) => {
    return this._rows[i];
  }

	render() {
		return (
			<ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
        minHeight={500} />
		);
	}
}

export default Results;