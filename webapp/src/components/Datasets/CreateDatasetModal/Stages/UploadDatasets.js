/* eslint-disable import/no-named-as-default */
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import { changeDatasetTitle, upload, useExamTypeDataset } from '../../../../actions/datasets';

import UploadItem from './UploadItem';


const UploadDatasets = ({ items, examDataset, updateExamDataset }) => (
  <div className="upload-datasets">
    <UploadItem adding />
    <Form>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" onChange={() => updateExamDataset(!examDataset)} /> Dataset will be used in exam
        </Label>
      </FormGroup>
    </Form>
    {items.map(item => (
      <UploadItem
        key={item.id}
        item={item}
        options={{ examDataset }} />
    ))}
  </div>
)

const mapStateToProps = state => ({
  items: state.dataset.create.items,
  examDataset: state.dataset.create.examDataset
});

const mapDispatchToProps = dispatch => ({
  updateExamDataset: (examDataset) => dispatch(useExamTypeDataset(examDataset))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadDatasets);