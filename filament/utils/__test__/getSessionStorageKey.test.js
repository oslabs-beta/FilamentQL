import getSessionStorageKey from '../getSessionStorageKey';

describe('getSessionStorageKey', () => {
  const queryFull = `
    query {
      todos { 
        id
        text
        isCompleted
      }
    }
  `;

  const queryShort = `
    {
      todos { 
        id
        text
        isCompleted
      }
    }
  `;

  it('should get the correct key when string query is present', () => {
    const key = getSessionStorageKey(queryFull);

    expect(key).toEqual('todos');
  });

  it('should get the correct key even when string query is not present', () => {
    const key = getSessionStorageKey(queryShort);

    expect(key).toEqual('todos');
  });
});
