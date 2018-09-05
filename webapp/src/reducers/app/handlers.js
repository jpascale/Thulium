import C from '../../constants/app';
import objectAssign from 'object-assign';

export default {
  [C.CHANGE_ENGINE] : (state, engine) => {
    return objectAssign({}, state, { currentEngine: engine });
  }
}