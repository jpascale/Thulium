import C from '../../constants/app';
import CS from '../../constants/session';
import CE from '../../constants/engine';
import objectAssign from 'object-assign';

export default {
  [C.BOOTING] : (state) => {
    return objectAssign({}, state, { booting: true });
  },
  [C.BOOTED] : (state) => {
    return objectAssign({}, state, { booting: false });
  },
  [C.CHANGE_ENGINE] : (state, engine) => {
    return objectAssign({}, state, { currentEngine: engine });
  },
  [C.QUERY_CHANGED] : (state, query) => {
  	return objectAssign({}, state, { query });
  },
  [C.RUNNING] : (state) => {
  	return objectAssign({}, state, { running: true });
  },
  [C.RUN] : (state, results) => {
  	return objectAssign({}, state, { running: false, results });
  },

  [CS.START] : (state, session) => {
    return objectAssign({}, state, { session });
  },

  [CE.FETCHED] : (state, engineList) => {
    const engines = engineList.reduce((memo, val) => {
      memo[val.slug] = val;
      return memo;
    }, {});
    return objectAssign({}, state, { engines });
  }
}