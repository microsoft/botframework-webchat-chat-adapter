/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import { Role } from '../../../types/DirectLineTypes';

export default function createPatchFromRoleAndNameMiddleware(): IngressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState }) => next => (activity: IC3DirectLineActivity) => {
    const {
      from: { id, name, role, tag }
    } = activity;

    const userId = getState(StateKey.UserId);

    // TODO: Why use "id.includes" instead of string equal?
    const patchedRole = role === Role.Channel ? role : id.includes(userId) ? Role.User : Role.Bot;

    //Taking out for easier debugging
    let patchedActivity = {
      ...activity,
      from: {
        id,
        role: patchedRole,
        name: (patchedRole === Role.User && getState(StateKey.UserDisplayName)) || name,
        tag
      }
    }
    return next(patchedActivity);
  };
}
