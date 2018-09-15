import addProfileReducer from './add_profile_reducer.js';
import { combineReducers } from 'redux';
console.log('HIHIHI');
export default combineReducers({
  profiles: addProfileReducer
});
