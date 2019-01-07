import C from '../../constants/dataset';
import objectAssign from 'object-assign';

const nextStages = {
	'pick-type': 'upload-datasets',
	'upload-datasets': 'review-datasets'
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
	},

	[C.ADD_ITEM] : (state, title) => {
		const create = objectAssign({}, state.create, {
			items: state.create.items.concat({
				id: state.create.items.length,
				title
			})
		});
		return objectAssign({}, state, { create });
	},

	[C.ASSIGN_FILE_TO_ITEM] : (state, { id, data, headers, error }) => {
		const nextItems = state.create.items.slice();
		nextItems[id] = objectAssign({}, nextItems[id], { data, headers, error });
		const create = objectAssign({}, state.create, { items: nextItems });
		return objectAssign({}, state, { create });
	},
}