import createPatchFromRoleAndNameMiddleware from './../../../../src/ic3/enhancers/ingress/createPatchFromRoleAndNameMiddleware';
import { StateKey } from './../../../../src/types/ic3/IC3AdapterState';
import { Role } from './../../../../src/types/DirectLineTypes';

describe('createPatchFromRoleAndNameMiddleware test', () => {
    const next = jest.fn().mockReturnValue('next');
    test('should call next with correct params', () => {
        const getState = (key) => key === StateKey.UserId ? 'userId' : key === StateKey.UserDisplayName ? 'userName' : null;
        const activity = {
            from: {
                id: 'activityId',
                name: 'activityName',
                role: Role.User
            }
        }
        const result = createPatchFromRoleAndNameMiddleware()({ getState })(next)(activity);
        expect(result).toBe('next');
        expect(next).toHaveBeenCalledWith({
            from: {
                id: 'activityId',
                name: 'activityName',
                role: Role.Bot
            }
        });
    });

    test('should call next with correct params', () => {
        const getState = (key) => key === StateKey.UserId ? 'userId' : key === StateKey.UserDisplayName ? 'userName' : null;
        const activity = {
            from: {
                id: 'userIdActivity',
                name: 'activityName',
                role: Role.User
            }
        }
        const result = createPatchFromRoleAndNameMiddleware()({ getState })(next)(activity);
        expect(result).toBe('next');
        expect(next).toHaveBeenCalledWith({
            from: {
                id: 'userIdActivity',
                name: 'userName',
                role: Role.User
            }
        });
    });

    test('should call next with correct params', () => {
        const getState = (key) => key === StateKey.UserId ? 'userId' : key === StateKey.UserDisplayName ? 'userName' : null;
        const activity = {
            from: {
                id: 'userIdActivity',
                name: 'activityName',
                role: Role.Channel
            }
        }
        const result = createPatchFromRoleAndNameMiddleware()({ getState })(next)(activity);
        expect(result).toBe('next');
        expect(next).toHaveBeenCalledWith({...activity});
    });
});
