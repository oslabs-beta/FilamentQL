import parseServerFilamentQuery from '../parseServerFilamentQuery';

describe('parseServerFilamentQuery', () => {
  it('should ', () => {
    const result = transformQuery(uglyQuery);
    expect(result).toEqual(prettyQuery);
  });
});
