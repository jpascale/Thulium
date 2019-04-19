import C from '../../constants/app';
import CS from '../../constants/session';
import CE from '../../constants/engine';
import CF from '../../constants/file';
import CC from '../../constants/course';
import objectAssign from 'object-assign';

export default {
  [C.BOOTING] : (state) => {
    return objectAssign({}, state, { booting: true });
  },
  [C.BOOTED] : (state) => {
    return objectAssign({}, state, { booting: false });
  },
  [CE.CHANGE] : (state, engine) => {
    return objectAssign({}, state, { currentEngine: engine });
  },
  [CF.CHANGE] : (state, selectedFile) => {
    if (state.selectedFile === selectedFile) return state;
    return objectAssign({}, state, { selectedFile });
  },
  [CF.SHOW_CREATE_MODAL] : (state) => {
    if (state.createFileModal) return state;
    return objectAssign({}, state, { createFileModal: true });
  },
  [CF.CLOSE_CREATE_MODAL] : (state) => {
    if (!state.createFileModal) return state;
    return objectAssign({}, state, { createFileModal: false });
  },
  [CF.CREATING] : (state) => {
    return objectAssign({}, state, { creatingFile: true });
  },
  [CF.CREATED] : (state, file) => {
    const nextFiles = objectAssign({}, state.files, {
      [file._id]: file
    });
    return objectAssign({}, state, {
      creatingFile: false,
      files: nextFiles
    });
  },
  [CF.AUTOSAVING] : (state, query) => {
  	return objectAssign({}, state, { autosaving: true });
  },
  [CF.AUTOSAVED] : (state, query) => {
  	return objectAssign({}, state, { autosaving: false });
  },
  [C.RUNNING] : (state) => {
  	return objectAssign({}, state, { running: true });
  },
  [C.RUN] : (state, results) => {
  	return objectAssign({}, state, { running: false, results });
  },

  [CS.START] : (state, sessionData) => {
    const { files: fileList, ...session } = sessionData;
    const selectedFile = fileList.length ? fileList[0]._id : void 8;
    const files = fileList.reduce((memo, file) => {
      memo[file._id] = file;
      return memo;
    }, {})
    return objectAssign({}, state, {
      session: session,
      files,
      selectedFile
    });
  },

  [CE.FETCHED] : (state, engineList) => {
    const currentEngine = engineList.length ? engineList[0]._id : void 8;
    const engines = engineList.reduce((memo, val) => {
      memo[val._id] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { engines, currentEngine });
  },
  [CC.FETCHED] : (state, data) => {
    const courses = data.memberships.reduce((memo, val) => {
      memo[val.courseId] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { courses });
  }
}