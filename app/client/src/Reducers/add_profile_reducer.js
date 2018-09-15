const initialState = {};

export default function ProfileReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case 'ADD_PROFILE':
      return {
        ...state,
        profile: action.object
      };
    case 'REMOVE_PROFILE':
      return {
        ...state,
        list: [...state.list.slice(0, state.list.length - 1)]
      };
  }
  return state;
}
