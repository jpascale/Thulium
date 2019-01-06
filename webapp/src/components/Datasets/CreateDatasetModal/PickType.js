/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { changeDatasetType } from '../../../actions/datasets';

const src = title => `https://placeholdit.imgix.net/~text?txtsize=33&txt=${title}&w=200&h=150`

const PickType = ({ type, changeDatasetType }) => (
	<div className="text-center pick-type">
		<img onClick={() => changeDatasetType('sql')} src={src('SQL')} className={classNames('rounded img-thumbnail', { selected: type === 'sql' })}></img>
		<img onClick={() => changeDatasetType('nosql')} src={src('NoSQL')} className={classNames('rounded img-thumbnail', { selected: type === 'nosql'})}></img>
	</div>
);

const mapStateToProps = state => ({
	type: state.dataset.create.type
});

const mapDispatchToProps = dispatch => ({
	changeDatasetType: type => dispatch(changeDatasetType(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(PickType);