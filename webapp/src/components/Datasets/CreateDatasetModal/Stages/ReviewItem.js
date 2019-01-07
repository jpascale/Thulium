/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';
import ReactDataGrid, { HeaderCell } from 'react-data-grid';

import { addItemToDataset, assignFileToItem, upload } from '../../../../actions/datasets';

import AddIcon from '../../../common/AddIcon';

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(i + b));

const DISPLAYED_ROWS = 5;

const dataGridBaseOptions = {
	editable: true,
	headerRenderer: ({ column }) => {
		const style = {
			width: column.width,
			lefth: column.lefth,
			display: 'inline-block',
      position: 'absolute',
      height: 35,
      margin: 0,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
		};
		return <div className="widget-HeaderCell__value">{column.name}</div>;
	}
};

class ReviewItem extends React.Component {

	state = {
	}

	handleChange = key => e => this.setState({ [key]: e.target.value })
	rowGetter = i => this.props.item.data[i];
	onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
		// this.setState(state => {
		//   const rows = state.rows.slice();
		//   for (let i = fromRow; i <= toRow; i++) {
		//     rows[i] = { ...rows[i], ...updated };
		//   }
		//   return { rows };
		// });
	}

	render = () => {
		const { item } = this.props;

		const dataGridColumns = ((headers) => {
			if (!headers.length) {
				return range(item.data[0].length, 1, i => Object.assign({ name: `column_${i}`, key: i }, dataGridBaseOptions));
			}
			return headers.map((name, key) => Object.assign({ name, key }, dataGridBaseOptions));
		})(item.headers);

		return (
			<React.Fragment>
				<h5>Data preview (First {Math.min(item.data.length, DISPLAYED_ROWS)} rows)</h5>
				<ReactDataGrid
					columns={dataGridColumns}
					rowGetter={this.rowGetter}
					rowsCount={Math.min(item.data.length, DISPLAYED_ROWS)}
					minHeight={230}
					onGridRowsUpdated={this.onGridRowsUpdated}
					enableCellSelect={true}
					toolbar={<div>Hola</div>}/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
	
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewItem);