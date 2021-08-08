import createIngressEnhancer from './../../../../src/ic3/enhancers/ingress/index';
import * as redux from 'redux';
import * as createExtractAdaptiveCardMiddleware from './../../../../src/ic3/enhancers/ingress/createExtractAdaptiveCardMiddleware';
import * as createPatchFromRoleAndNameMiddleware from './../../../../src/ic3/enhancers/ingress/createPatchFromRoleAndNameMiddleware';
import * as createSubscribeNewMessageAndThreadUpdateEnhancer from './../../../../src/ic3/enhancers/ingress/subscribeNewMessageAndThreadUpdate';
import * as applyIngressMiddleware from './../../../../src/applyIngressMiddleware';

describe('createIngressEnhancer test', () => {
    test('should call compose with correct params', () => {
        spyOn(redux, 'compose').and.returnValue('compose');
        applyIngressMiddleware.default = jest.fn().mockReturnValue('mock1');
        createExtractAdaptiveCardMiddleware.default = jest.fn().mockReturnValue('mock2');    
        createPatchFromRoleAndNameMiddleware.default = jest.fn().mockReturnValue('mock3');
        createSubscribeNewMessageAndThreadUpdateEnhancer.default = jest.fn().mockReturnValue('mock4');
        const result = createIngressEnhancer();
        expect(redux.compose).toHaveBeenCalledWith('mock4', 'mock1');
        expect(applyIngressMiddleware.default).toHaveBeenCalledWith('mock3', 'mock2');
        expect(result).toBe('compose')
    })
});
