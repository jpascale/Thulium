/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';

import { changeDatasetTitle, upload } from '../../../../actions/datasets';

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
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);