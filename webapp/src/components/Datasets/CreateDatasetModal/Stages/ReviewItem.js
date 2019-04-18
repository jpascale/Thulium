/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';

import { updateDataForItem, updateHeaderForItem, updateTypeForItem } from '../../../../actions/datasets';

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(i + b));

const { DropDownEditor } = Editors;
const columnTypes = [
	'String',
	'Int',
	'Float',
	'Boolean'
].map(t => ({ id: t, value: t}));

const ColumnTypeEditor = <DropDownEditor options={columnTypes} />;

const rdgEditorContainerStyle = {
	position: 'absolute',
	top: 0,
	left: 0
};

class _EditableHeader extends React.Component {
	
	state = { title: this.props.column.name }

	handleChange = key => e => this.setState({ [key]: e.target.value })
	enableEditing = () => this.setState({ editing: true, previousTitle: this.state.title })
	toggleEditing = () => this.setState({ editing: !this.state.editing })
	handleKeyPress = e => {
		const { item, column } = this.props;
		if (e.key !== 'Enter') return;
		this.toggleEditing();
		this.props.updateHeaderForItem(item.id, {
			index: column.idx,
			value: this.state.title
		});
	}
	onBlur = () => this.setState({ title: this.state.previousTitle, editing: false})

	render = () => {
		const { editing, title } = this.state;
		
		if (editing) {
			return (
				<div className="rdg-editor-container" style={rdgEditorContainerStyle}>
					<input className="form-control editor-main" value={title} onBlur={this.onBlur} onKeyPress={this.handleKeyPress} onChange={this.handleChange('title')}/>
				</div>
			)
		}
		return <div onDoubleClick={this.enableEditing} className="widget-HeaderCell__value">{title}</div>;
	}
}

const EditableHeader = connect(
	state => ({}),
	dispatch => ({
		updateHeaderForItem: (id, delta) => dispatch(updateHeaderForItem(id, delta))
	})
)(_EditableHeader);

const DISPLAYED_ROWS = 5;

const dataGridBaseOptions = {
	editable: true
};

class ReviewItem extends React.Component {

	handleChange = key => e => this.setState({ [key]: e.target.value })
	rowGetter = i => this.props.item.data[i];
	onUpdateColumnTypes = ({ fromRow, toRow, updated }) => {
		const { item, updateTypeForItem } = this.props;
		const index = parseInt(Object.keys(updated)[0], 10);
		updateTypeForItem(item.id, {
			index,
			value: updated[index]
		});
	}

	onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
		const { item, updateDataForItem } = this.props;
		const index = parseInt(Object.keys(updated)[0], 10);
		updateDataForItem(item.id, {
			row: fromRow,
			index,
			value: updated[index]
		});
  };

	render = () => {
		const { item } = this.props;

		const dataGridColumns = ((headers) => {
			if (!headers.length) {
				return range(item.data[0].length, 1, key => {
					const name = `column_${key}`
					return Object.assign({
						name,
						key,
						width: Math.max(10 + name.length * 10, 100),
						headerRenderer: ({ column }) => <EditableHeader column={column} item={item} />
					}, dataGridBaseOptions);
				});
			}
			return headers.map((name, _key) => {
				const key = _key.toString();
				return Object.assign({
					name,
					key,
					width: Math.max(10 + name.length * 10, 100),
					headerRenderer: ({ column }) => <EditableHeader column={column} item={item} />
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
					minHeight={160}
					rowHeight={20}
					headerRowHeight={35}
					onGridRowsUpdated={this.onGridRowsUpdated}
					enableCellSelect={true} />
				<small className="text-info">Double click to edit cell value or column name</small>
				<h5>Column Types</h5>
				<ReactDataGrid
					columns={dataGridColumnsTypes}
					rowGetter={() => item.types}
					rowsCount={1}
					minHeight={80}
					rowHeight={20}
					headerRowHeight={35}
					onGridRowsUpdated={this.onUpdateColumnTypes}
					enableCellSelect={true} />
				<small className="text-info">Double click to change column type</small>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
	updateDataForItem: (id, delta) => dispatch(updateDataForItem(id, delta)),
	updateTypeForItem: (id, delta) => dispatch(updateTypeForItem(id, delta))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewItem);