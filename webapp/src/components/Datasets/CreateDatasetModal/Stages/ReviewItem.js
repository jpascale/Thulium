/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';

const { DropDownEditor } = Editors;
const columnTypes = [
	'String',
	'Number',
	'Date'
].map(t => ({ id: t, value: t}));

const ColumnTypeEditor = <DropDownEditor options={columnTypes} />;

import { addItemToDataset, assignFileToItem, upload } from '../../../../actions/datasets';

import AddIcon from '../../../common/AddIcon';

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(i + b));

const DISPLAYED_ROWS = 5;

const rdgEditorContainerStyle = {
	position: 'absolute',
	top: 0,
	left: 0
};

class EditableHeader extends React.Component {
	
	state ={
		title: this.props.column.name
	}

	handleChange = key => e => this.setState({ [key]: e.target.value })
	enableEditing = () => this.setState({ editing: true, previousTitle: this.state.title })
	toggleEditing = () => this.setState({ editing: !this.state.editing })
	handleKeyPress = e => e.key === 'Enter' && this.toggleEditing()
	onBlur = () => this.setState({ title: this.state.previousTitle, editing: false})

	render = () => {
		const { column } = this.props;
		const { editing, title } = this.state;
		
		if (editing) {
			return (
				<div className="rdg-editor-container" style={rdgEditorContainerStyle}>
					<input className="form-control editor-main" value={title} onBlur={this.onBlur} onKeyPress={this.handleKeyPress} onChange={this.handleChange('title')}/>
				</div>
			)
		}
		return (
			<div onDoubleClick={this.enableEditing} className="widget-HeaderCell__value">{title}</div>
		);
	}
}

const dataGridBaseOptions = {
	editable: true,
	headerRenderer: ({ column }) => {
		return <EditableHeader column={column} />;
	}
};

class ReviewItem extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			columnTypes: this._guessColumnTypes()
		}
	}

	_guessColumnTypes = () => {
		const { item } = this.props;
		
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
				return range(item.data[0].length, 1, key => {
					const name = `column_${i}`
					return Object.assign({
						name,
						key,
						width: Math.max(10 + name.length * 10, 100)
					}, dataGridBaseOptions);
				});
			}
			return headers.map((name, key) => {
				return Object.assign({
					name,
					key,
					width: Math.max(10 + name.length * 10, 100)
				}, dataGridBaseOptions);
			});
		})(item.headers);

		const dataGridColumnsTypes = dataGridColumns.map(c => ({ ...c, editor: ColumnTypeEditor }));

		return (
			<React.Fragment>
				<h5>Data preview (First {Math.min(item.data.length, DISPLAYED_ROWS)} rows)</h5>
				<ReactDataGrid
					columns={dataGridColumns}
					rowGetter={this.rowGetter}
					rowsCount={Math.min(item.data.length, DISPLAYED_ROWS)}
					minHeight={140}
					rowHeight={20}
					headerRowHeight={35}
					onGridRowsUpdated={this.onGridRowsUpdated}
					enableCellSelect={true} />
				<p className="text-info">Double click to edit cell value or column name</p>
				<ReactDataGrid
					columns={dataGridColumnsTypes}
					rowGetter={this.rowGetter}
					rowsCount={1}
					minHeight={140}
					rowHeight={20}
					headerRowHeight={35}
					onGridRowsUpdated={this.onGridRowsUpdated}
					enableCellSelect={true} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
	
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewItem);