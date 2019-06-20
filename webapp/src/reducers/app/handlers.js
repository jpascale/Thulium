import C from '../../constants/app';
import CS from '../../constants/session';
import CE from '../../constants/engine';
import CF from '../../constants/file';
import CC from '../../constants/course';
import CD from '../../constants/dataset';
import CEX from '../../constants/exams';
import objectAssign from 'object-assign';

export default {
  [C.BOOTING]: (state) => {
    return objectAssign({}, state, { booting: true });
  },
  [C.BOOTED]: (state) => {
    return objectAssign({}, state, { booting: false });
  },
  [CE.CHANGE]: (state, engine) => {
    if (state.currentEngine === engine) return state;
    return objectAssign({}, state, { currentEngine: engine });
  },
  [CF.CHANGE]: (state, selectedFile) => {
    return objectAssign({}, state, { selectedFile, selectedTab: 'file' });
  },
  [CF.CHANGE_RESPONSE]: (state, { file, response }) => {
    const modifiedFile = objectAssign({}, state.files[state.selectedFile], { response });
    const files = objectAssign({}, state.files, { [modifiedFile._id]: modifiedFile });
    return objectAssign({}, state, { files });
  },
  [C.CHANGE_TEXT]: (state, currentText) => {
    // Modify current file
    const modifiedFile = objectAssign({}, state.files[state.selectedFile], { content: currentText });
    const files = objectAssign({}, state.files, { [modifiedFile._id]: modifiedFile });
    const stateWithModifiedFile = objectAssign({}, state, { files });

    // Modify current text
    return objectAssign({}, stateWithModifiedFile, { currentText });
  },
  [C.TOGGLE_TASK]: state => {
    return objectAssign({}, state, { showTask: !state.showTask });
  },
  [CF.SHOW_CREATE_MODAL]: (state) => {
    if (state.createFileModal) return state;
    return objectAssign({}, state, { createFileModal: true });
  },
  [CF.CLOSE_CREATE_MODAL]: (state) => {
    if (!state.createFileModal) return state;
    return objectAssign({}, state, { createFileModal: false });
  },
  [CF.CREATING]: (state) => {
    return objectAssign({}, state, { creatingFile: true });
  },
  [CF.CREATED]: (state, file) => {
    const nextFiles = objectAssign({}, state.files, {
      [file._id]: file
    });
    return objectAssign({}, state, {
      creatingFile: false,
      selectedFile: file._id,
      files: nextFiles
    });
  },
  [CF.AUTOSAVING]: (state, query) => {
    return objectAssign({}, state, { autosaving: true });
  },
  [CF.AUTOSAVED]: (state, query) => {
    return objectAssign({}, state, { autosaving: false });
  },
  [C.RUNNING]: (state) => {
    return objectAssign({}, state, { running: true });
  },
  [C.RUN]: (state, results) => {
    return objectAssign({}, state, { running: false, results, error: null });
  },
  [C.RUN_FAILED]: (state, error) => {
    return objectAssign({}, state, { running: false, error, results: null });
  },

  [CS.START]: (state, sessionData) => {
    const { files: fileList, ...session } = sessionData;
    const selectedFile = fileList.length ? fileList[0]._id : void 8;
    const files = fileList.reduce((memo, file) => {
      memo[file._id] = file;
      return memo;
    }, {})
    return objectAssign({}, state, {
      session: session,
      files,
      selectedFile,
      selectedTab: 'file'
    });
  },

  [CE.FETCHED]: (state, engineList) => {
    const currentEngine = engineList.length ? engineList[0]._id : void 8;
    const engines = engineList.reduce((memo, val) => {
      memo[val._id] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { engines, currentEngine });
  },
  [CD.FETCHED]: (state, datasetList) => {
    // const currentEngine = datasetList.length ? datasetList[0]._id : void 8;
    const datasets = datasetList.reduce((memo, val) => {
      memo[val._id] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { datasets });
  },
  [CD.FETCHED_DATASET_INSTANCES]: (state, list) => {
    const instances = list.reduce((memo, val) => {
      memo[val._id] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { instances });
  },
  [CD.SHOW_DATASET_MODAL]: (state, show) => {
    return objectAssign({}, state, { showDatasetModal: show });
  },
  [CD.CREATED_DATASET]: (state, dataset) => {
    const nextDatasets = Object.assign({}, state.datasets, { [dataset._id]: dataset });
    return objectAssign({}, state, { datasets: nextDatasets });
  },
  [CC.FETCHED]: (state, data) => {
    const courses = data.memberships.reduce((memo, val) => {
      memo[val.courseId] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { courses });
  },
  [CC.CHANGE]: (state, course) => {
    return objectAssign({}, state, { selectedCourse: course, selectedTab: 'course' });
  },
  [CEX.SET_EXAM_MODE]: (state, on) => {
    return objectAssign({}, state, { examMode: on });
  },

  [C.NOTIFY]: (state, notification) => {
    const nextNotifications = state.notifications.concat(notification);
    return objectAssign({}, state, { notifications: nextNotifications });
  },
  [C.CLOSE_NOTIFICATION]: (state, id) => {
    const nextNotifications = state.notifications.slice();
    const idx = nextNotifications.findIndex(n => n.id === id);
    if (~idx) {
      nextNotifications.splice(idx, 1);
    }
    return objectAssign({}, state, { notifications: nextNotifications });
  },
}