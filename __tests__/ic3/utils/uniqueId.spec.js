import uniqueId from './../../../src/ic3/utils/uniqueId';

describe('uniqueId test', () => {
    test('', () => {
        spyOn(Number.prototype, 'toString').and.returnValue('123');
        spyOn(String.prototype, 'substr').and.returnValue('3');
        const result = uniqueId();
        expect(Number.prototype.toString).toHaveBeenCalledWith(36);
        expect(String.prototype.substr).toHaveBeenCalledWith(2);
        expect(result).toBe('3');
    });
});
