/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';

import { changeDatasetTitle, upload, useExamTypeDataset } from '../../../../actions/datasets';

import UploadItem from './UploadItem';


const UploadDatasets = ({ items, exam, updateExamDataset, sql }) => (
  <div className="upload-datasets">
    <Alert color="primary">
      <h5>Exam Settings</h5>
      <Form>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" onChange={() => updateExamDataset(!exam)} /> Check this box if this dataset will be used in an exam
          </Label>
        </FormGroup>
      </Form>
    </Alert>
    {/*<Alert color="light">
      <h5>Hidden File</h5>
      The hidden file is meant to be used to check that a query response is correct for the 
</Alert>*/}
    {items.length ? null : (
      <span className="text-muted">Press {'"'}+ Add {sql ? 'Table' : 'Collection'}{'"'} to get started 👇</span>
    )}
    <UploadItem adding />
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
  exam: state.dataset.create.exam,
  sql: state.dataset.create.paradigm === 'sql'
});

const mapDispatchToProps = dispatch => ({
  updateExamDataset: exam => dispatch(useExamTypeDataset(exam))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);