const axios = require('axios');

/*
 * action types
 */

export const ADD_PROFILE = 'ADD_PROFILE';
export const REMOVE_PROFILE = 'REMOVE_PROFILE';

/*
 * action creators
 */

export const addProfile = object => dispatch => {
  dispatch({
    type: ADD_PROFILE,
    object
  });
  return Promise.resolve();
};

export function removeProfile(object) {
  return { type: REMOVE_PROFILE, object };
}
