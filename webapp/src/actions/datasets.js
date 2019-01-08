import CD from '../constants/dataset';
import * as DatasetService from '../services/dataset';
import Papa from 'papaparse';

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

export const addItemToDataset = title => ({
  type: CD.ADD_ITEM,
  payload: title
});

export const assignFileToItem = (id, file, { firstLine }) => dispatch => {
  return Papa.parsePromise(file, { skipEmptyLines: true }).then(({ data }) => {
    return dispatch({
      type: CD.ASSIGN_FILE_TO_ITEM,
      payload: {
        id,
        data: firstLine ? data.slice(1) : data,
        headers: firstLine ? data[0] : []
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