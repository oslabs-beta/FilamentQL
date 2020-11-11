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

  it('should return the key as string', () => {
    const key = getSessionStorageKey(queryFull);
    expect(typeof key).toEqual('string');
  });

  it('should get the correct key when `query` is present', () => {
    const key = getSessionStorageKey(queryFull);
    expect(key).toEqual('todos');
  });

  it('should get the correct key even when `query` is not present', () => {
    const key = getSessionStorageKey(queryShort);
    expect(key).toEqual('todos');
  });
});
