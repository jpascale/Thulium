import CD from '../constants/dataset';
import * as DatasetService from '../services/dataset';
import Papa from 'papaparse';
import isInt from 'validator/lib/isInt';
import isFloat from 'validator/lib/isFloat';
import isBoolean from 'validator/lib/isBoolean';

Papa.parsePromise = (file, options) => new Promise((complete, error) => {
  Papa.parse(file, Object.assign(options, { complete, error }))
});

const uploadingFile = () => ({
  type: CD.UPLOADING_FILE,
  loading: true
});

const uploaded = (data) => (dispatch, getState) => {
  dispatch({
    type: CD.UPLOADED,
    payload: { data }
  });
};

const uploadFailed = () => ({
  type: CD.UPLOAD_FAILED
});

export const upload = (data) => (dispatch, getState) => {
  dispatch(uploadingFile());
  return DatasetService.upload(data).then(data => {
    dispatch(uploaded(data))
  })
}

// -----


export const changeDatasetTitle = title => ({
  type: CD.CHANGE_TITLE,
  payload: title
});

export const changeDatasetType = type => ({
  type: CD.CHANGE_TYPE,
  payload: type
});

export const nextStage = () => ({ type: CD.NEXT_STAGE });
export const prevStage = () => ({ type: CD.PREV_STAGE });

export const addItemToDataset = title => ({
  type: CD.ADD_ITEM,
  payload: title
});

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(i + b));

export const assignFileToItem = (id, file, { firstLine }) => dispatch => {
  return Papa.parsePromise(file, { skipEmptyLines: true }).then(({ data: _data }) => {
    const headers = firstLine ? _data[0] : [];
    const data = firstLine ? _data.slice(1) : _data;
    if (!data.length) {
      return dispatch({
        type: CD.ASSIGN_FILE_TO_ITEM,
        payload: { id, error: true, errorText: 'File is empty' }
      });
    }
    
    
    const types = range(data[0].length, 0, i => {
      const values = data.slice(0, 5).map(row => row[i]);
      const isAnInt = values.filter(isInt).length === values.length;
      if (isAnInt) return 'Int';
      const isAFloat = values.filter(isFloat).length === values.length;
      if (isAFloat) return 'Float';
      const isABoolean = values.filter(isBoolean).length === values.length;
      if (isABoolean) return 'Boolean';
      return  'String';
    });

    return dispatch({
      type: CD.ASSIGN_FILE_TO_ITEM,
      payload: {
        id,
        data,
        headers,
        types
      }
    });
  }, err => {
    console.error(err);
    return dispatch({
      type: CD.ASSIGN_FILE_TO_ITEM,
      payload: { id, error: true }
    });
  });
};

export const updateDataForItem = (id, delta) => ({
  type: CD.UPDATE_DATA_FOR_ITEM,
  payload: { id, delta }
});

export const updateHeaderForItem = (id, delta) => ({
  type: CD.UPDATE_HEADER_FOR_ITEM,
  payload: { id, delta }
});

export const updateTypeForItem = (id, delta) => ({
  type: CD.UPDATE_TYPE_FOR_ITEM,
  payload: { id, delta }
});