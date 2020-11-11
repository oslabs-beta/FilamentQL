import transformQuery from '../transformQuery';

describe('transformQuery', () => {
  const uglyQuery = 'query { todos { id text isCompleted } }';
  const prettyQuery = `  query {
    todos {
      id
      text
      isCompleted
    }
  }
`;

  it('should return a new query as a string', () => {
    const result = transformQuery(uglyQuery);
    expect(typeof result).toEqual('string');
  });

  it('should prettify query with 2 indentations', () => {
    const result = transformQuery(uglyQuery);
    expect(result).toEqual(prettyQuery);
  });
});
