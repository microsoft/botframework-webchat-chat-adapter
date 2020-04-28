/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import { SenderRole } from '../../../types/DirectLineTypes';

export default function createIngressOverrideDirectLineFromFieldMiddleware(): IngressMiddleware<
  ActivityMessageThread,
  IC3AdapterState
> {
  return ({ getConfig }) => next => (activityMessageThread: ActivityMessageThread) => {
    if (!('activity' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const { activity } = activityMessageThread;

    const {
      from: { id, name }
    } = activity;

    const role = id.includes(getConfig(StateKey.UserId)) ? SenderRole.User : SenderRole.Bot;

    return next({
      activity: {
        ...activity,
        from: {
          id,
          role,
          name: (role === SenderRole.User && getConfig(StateKey.UserDisplayName)) || name
        }
      }
    });
  };
}
