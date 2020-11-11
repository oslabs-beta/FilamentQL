import parseClientFilamentQuery from '../parseClientFilamentQuery';

describe('parseClientFilamentQuery', () => {
  it('should ', () => {
    const result = transformQuery(uglyQuery);
    expect(result).toEqual(prettyQuery);
  });
});
