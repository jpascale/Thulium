import C from '../../constants/app';
import objectAssign from 'object-assign';

export default {
  [C.CHANGE_ENGINE] : (state, engine) => {
    return objectAssign({}, state, { currentEngine: engine });
  },
  [C.QUERY_CHANGED] : (state, query) => {
  	return objectAssign({}, state, { query });
  },
  [C.RUNNING] : (state) => {
  	return objectAssign({}, state, { running: true });
  },
  [C.RUN] : (state) => {
  	return objectAssign({}, state, { running: false });
  }
}