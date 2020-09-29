import createEgressEnhancer from './../../../../src/ic3/enhancers/egress/index';
import * as applyEgressMiddleware from './../../../../src/applyEgressMiddleware';
import * as createEgressFileAttachmentMiddleware from './../../../../src/ic3/enhancers/egress/createEgressFileAttachmentMiddleware';
import * as createEgressMessageActivityMiddleware from './../../../../src/ic3/enhancers/egress/createEgressMessageActivityMiddleware';
import * as createEgressTypingActivityMiddleware from './../../../../src/ic3/enhancers/egress/createEgressTypingActivityMiddleware';

describe('createEgressEnhancer test', () => {
    test('should call applyEgressMiddleware with correct params', () => {
        spyOn(applyEgressMiddleware, 'default');
        createEgressFileAttachmentMiddleware.default = jest.fn().mockReturnValue('mock1');    
        createEgressMessageActivityMiddleware.default = jest.fn().mockReturnValue('mock2');
        createEgressTypingActivityMiddleware.default = jest.fn().mockReturnValue('mock2');
    
        createEgressEnhancer();

        expect(applyEgressMiddleware.default).toHaveBeenCalledWith('mock1', 'mock2', 'mock2');
    });
});
