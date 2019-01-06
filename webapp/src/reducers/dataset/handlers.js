import C from '../../constants/dataset';
import objectAssign from 'object-assign';

const nextStages = {
	'pick-type': 'upload-datasets'
};

export default {
  [C.CHANGE_TITLE] : (state, title) => {
		const create = objectAssign({}, state.create, { title });
		return objectAssign({}, state, { create });
	},

	[C.CHANGE_TYPE] : (state, type) => {
		const create = objectAssign({}, state.create, { type });
		return objectAssign({}, state, { create });
	},

	[C.NEXT_STAGE] : (state) => {
		const create = objectAssign({}, state.create, {
			stage: nextStages[state.create.stage]
		});
		return objectAssign({}, state, { create });
	}
}