/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Collapse, CardBody, Card, CardHeader } from 'reactstrap';
import classNames from 'classnames';

import { changeDatasetTitle, upload } from '../../../actions/datasets';

import UploadItem from './UploadItem';

const UploadDatasets = ({ items }) => (
  <div className="upload-datasets">
    <UploadItem adding />
    {items.map(item => (
      <UploadItem key={item.id} item={item} />
    ))}
  </div>
)

const mapStateToProps = state => ({
  items: state.dataset.create.items
});

const mapDispatchToProps = dispatch => ({
  changeDatasetTitle: title => dispatch(changeDatasetTitle(title)),
  handleUpload: data => dispatch(upload(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);