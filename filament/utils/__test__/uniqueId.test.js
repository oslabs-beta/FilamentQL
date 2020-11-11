import uniqueId from '../uniqueId';

describe('uniqueId', () => {
  it('should get new unique id for different invocation', () => {
    const id1 = uniqueId();
    const id2 = uniqueId();

    expect(id1).not.toEqual(id2);
  });
});
