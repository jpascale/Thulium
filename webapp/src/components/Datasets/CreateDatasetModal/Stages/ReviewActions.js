/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input, FormText, Col } from 'reactstrap';
import classNames from 'classnames';
import { updateDatasetActions } from '../../../../actions/datasets';

const actionsRepo = {
	ddl: {
		can_create: {
			title: 'CREATE',
			detail: 'is used to create the database or its objects (like table, index, function, views, store procedure and triggers).'
		},
		can_drop: {
			title: 'DROP',
			detail: 'is used to delete objects from the database.'
		},
		can_alter: {
			title: 'ALTER',
			detail: 'is used to alter the structure of the database.'
		},
		can_truncate: {
			title: 'TRUNCATE',
			detail: 'is used to remove all records from a table, including all spaces allocated for the records are removed.'
		},
		can_comment: {
			title: 'COMMENT',
			detail: 'is used to add comments to the data dictionary.'
		},
		can_rename: {
			title: 'RENAME',
			detail: 'is used to rename an object existing in the database.'
		},
	},

	dml: {
		can_insert: {
			title: 'INSERT',
			detail: 'is used to insert data into a table.'
		},
		can_update: {
			title: 'UPDATE',
			detail: 'is used to update existing data within a table.'
		},
		can_delete: {
			title: 'DELETE',
			detail: 'is used to delete records from a database table.'
		},
	},

	dcl: {
		can_grant: {
			title: 'GRANT',
			detail: 'gives user’s access privileges to database.'
		},
		can_revoke: {
			title: 'REVOKE',
			detail: 'withdraw user’s access privileges given by using the GRANT command.'
		},
	},

	tcl: {
		can_commit: {
			title: 'COMMIT',
			detail: 'commits a Transaction.'
		},
		can_rollback: {
			title: 'ROLLBACK',
			detail: 'rollbacks a transaction in case of any error occurs.'
		},
		can_savepoint: {
			title: 'SAVEPOINT',
			detail: 'sets a savepoint within a transaction.'
		},
		can_set_transaction: {
			title: 'SET TRANSACTION',
			detail: 'specify characteristics for the transaction.'
		},
	}
};

const categoryTitles = {
	ddl: 'DDL (Data Definition Language)',
	dml: 'DML (Data Manipulation Language)',
	dcl: 'DCL (Data Control Language)',
	tcl: 'TCL (transaction Control Language)'
};

class ReviewActions extends React.Component {
	state = {
		actions: Object.keys(actionsRepo).reduce((memo, val) => {
			Object.assign(memo, Object.keys(actionsRepo[val]).reduce((memo, val) => {
				memo[val] = false;
				return memo;
			}, {}));
			return memo;
		}, {})
	}

	componentDidMount = () => this.props.updateDatasetActions(this.state.actions)
	componentDidUpdate = () => this.props.updateDatasetActions(this.state.actions)

	toggleUpdateAction = key => () => {
		const { actions } = this.state;
		const nextActions = Object.assign({}, actions, { [key]: !actions[key] });
		console.log(nextActions);
		this.setState({ actions: nextActions });
	}

	render = () => {
		const { actions } = this.state;
		return (
			<div className="review-datasets d-flex flex-column">
				<h4>Dataset Permissions</h4>
				<p className="text-muted">Select what is allowed for this dataset</p>
				<div className="d-flex flex-row">
					{Object.keys(actionsRepo).map(key => (
						<Col sm={3}>
							<h6>{categoryTitles[key]}</h6>
							<Form>
								{Object.keys(actionsRepo[key]).map(action => (
									<FormGroup key={action} check>
										<Input type="checkbox" onChange={this.toggleUpdateAction(action)} value={actions[action]} />
										<Label for={action} check>{actionsRepo[key][action].title}</Label>
										<FormText color="muted">{actionsRepo[key][action].detail}</FormText>
									</FormGroup>
								))}
							</Form>
						</Col>
					))}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
	updateDatasetActions: actions => dispatch(updateDatasetActions(actions))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewActions);