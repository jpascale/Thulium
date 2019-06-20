/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import { changeDatasetTitle, upload, useExamTypeDataset } from '../../../../actions/datasets';

import UploadItem from './UploadItem';


const UploadDatasets = ({ items, exam, updateExamDataset }) => (
  <div className="upload-datasets">
    {items.length ? null : (
      <span className="text-muted">Press "+ Add Collection" to get started 👇</span>
    )}
    <UploadItem adding />
    <Form>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" onChange={() => updateExamDataset(!exam)} /> Dataset will be used in exam
        </Label>
      </FormGroup>
    </Form>
    {items.map(item => (
      <UploadItem
        key={item.id}
        item={item}
        options={{ exam }} />
    ))}
  </div>
)

const mapStateToProps = state => ({
  items: state.dataset.create.items,
  exam: state.dataset.create.exam
});

const mapDispatchToProps = dispatch => ({
  updateExamDataset: exam => dispatch(useExamTypeDataset(exam))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);