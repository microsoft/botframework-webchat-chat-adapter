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
      from: { id, name, role }
    } = activity;

    const userId = getState(StateKey.UserId);
    const visitor = getState(StateKey.Visitor);
    let patchedRole;

    if (visitor) {
      patchedRole = id.includes("contacts/8:") ? Role.User : Role.Bot; // hardcoded signature for IC3 visitor
    } else {
      patchedRole = role === Role.Channel ? role : id.includes(userId) ? Role.User : Role.Bot;
    }

    //Taking out for easier debugging
    let patchedActivity = {
      ...activity,
      from: {
        id,
        role: patchedRole,
        name: (patchedRole === Role.User && getState(StateKey.UserDisplayName)) || name
      }
    }
    return next(patchedActivity);
  };
}
