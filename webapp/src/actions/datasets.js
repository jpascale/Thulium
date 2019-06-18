import CD from '../constants/dataset';
import * as DatasetService from '../services/dataset';
import Papa from 'papaparse';
import isInt from 'validator/lib/isInt';
import isFloat from 'validator/lib/isFloat';
import isBoolean from 'validator/lib/isBoolean';
import * as _ from 'lodash';

export const updateDatasetActions = (payload) => ({
  type: CD.UPDATE_DATASET_ACTIONS,
  payload
});

const fetchingDatasets = () => ({
  type: CD.FETCHING
});

const fetchedDatasets = (payload) => ({
  type: CD.FETCHED,
  payload
});

export const fetchDatasets = () => (dispatch, getState) => {
  dispatch(fetchingDatasets());

  return DatasetService.fetchAll({}, {
    token: getState().auth.token
  }).then(datasets => {
    return dispatch(fetchedDatasets(datasets));
  });
};

// Dataset instances
const fetchingDatasetInstances = () => ({
  type: CD.FETCHING_DATASET_INSTANCES
});

const fetchedDatasetInstances = (payload) => ({
  type: CD.FETCHED_DATASET_INSTANCES,
  payload
});

export const fetchDatasetInstances = () => (dispatch, getState) => {
  dispatch(fetchingDatasetInstances());

  return DatasetService.fetchAllInstances({}, {
    token: getState().auth.token
  }).then(datasetInstances => {
    return dispatch(fetchedDatasetInstances(datasetInstances));
  });
};

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

export const changeDatasetParadigm = paradigm => ({
  type: CD.CHANGE_TYPE,
  payload: paradigm
});

export const nextStage = () => ({ type: CD.NEXT_STAGE });
export const prevStage = () => ({ type: CD.PREV_STAGE });

export const addItemToDataset = title => ({
  type: CD.ADD_ITEM,
  payload: title
});

const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(i + b));

export const assignFileToItem = (id, file, { firstLine, exam, reducedFile }) => dispatch => {
  return Papa.parsePromise(file, { skipEmptyLines: true }).then(({ data: _data }) => {
    const headers = firstLine ? _data[0] : [];
    const data = firstLine ? _data.slice(1) : _data;
    if (!data.length) {
      return dispatch({
        type: CD.ASSIGN_FILE_TO_ITEM,
        payload: { id, error: true, errorText: 'File is empty' }
      });
    }

    const mapToTypes = (data) => (i) => {
      const values = data.slice(0, 5).map(row => row[i]);
      const isAnInt = values.filter(isInt).length === values.length;
      if (isAnInt) return 'Int';
      const isAFloat = values.filter(isFloat).length === values.length;
      if (isAFloat) return 'Float';
      const isABoolean = values.filter(isBoolean).length === values.length;
      if (isABoolean) return 'Boolean';
      return 'String';
    };

    const types = range(data[0].length, 0, mapToTypes(data));

    if (!exam) {
      return dispatch({
        type: CD.ASSIGN_FILE_TO_ITEM,
        payload: { id, data, headers, types }
      });
    }
    Papa.parsePromise(reducedFile, { skipEmptyLines: true }).then(({ data: _reducedData }) => {
      const reducedHeaders = firstLine ? _reducedData[0] : [];
      const reducedData = firstLine ? _reducedData.slice(1) : _data;
      if (!data.length) {
        return dispatch({
          type: CD.ASSIGN_FILE_TO_ITEM,
          payload: { id, error: true, errorText: 'Reduced file is empty' }
        });
      }

      const reducedTypes = range(data[0].length, 0, mapToTypes(reducedData));

      // Compare file schema
      if (!_.isEqual(types, reducedTypes) || !_.isEqual(headers, reducedHeaders)) {
        return dispatch({
          type: CD.ASSIGN_FILE_TO_ITEM,
          payload: { id, error: true, errorText: 'Schema provided in the reduced file does not repect main schema' }
        });
      }

      return dispatch({
        type: CD.ASSIGN_FILE_TO_ITEM,
        payload: {
          id,
          data,
          headers,
          types,
          reduced: {
            data: reducedData,
            headers: reducedHeaders,
            types: reducedTypes
          }
        }
      });

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

export const useExamTypeDataset = (exam) => ({
  type: CD.USE_EXAM_TYPE_DATASET,
  payload: { exam }
});

const creatingDataset = () => ({ type: CD.CREATING_DATASET });
const createdDataset = () => ({ type: CD.CREATED_DATASET });

export const createDataset = () => (dispatch, getState) => {
  dispatch(creatingDataset());
  const { paradigm, items, title, exam } = getState().dataset.create;
  const data = {
    paradigm,
    title,
    exam,
    actions,
    items: items.map(({ title, data, headers, types, reduced }) => ({
      title,
      data,
      headers,
      types,
      reduced
    })),
  };
  DatasetService.create(data, {
    token: getState().auth.token
  }).then(dataset => {
    return dispatch(createdDataset(dataset));
  });
};

export const showDatasetModal = show => ({
  type: CD.SHOW_DATASET_MODAL,
  payload: show
});

