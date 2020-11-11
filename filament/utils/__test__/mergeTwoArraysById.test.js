import mergeTwoArraysById from '../mergeTwoArraysById';

describe('mergeTwoArraysById', () => {
  const arr1 = [
    {
      id: 'todo-1',
      text: 'Finishing test',
      isCompleted: false,
    },
    {
      id: 'todo-2',
      text: 'Design landing page',
      isCompleted: true,
    },
    {
      id: 'todo-3',
      text: 'Deploy on AWS',
      isCompleted: true,
    },
  ];

  const arr2 = [
    {
      id: 'todo-1',
      difficulty: 5,
    },
    {
      id: 'todo-2',
      difficulty: 8,
    },
    {
      id: 'todo-3',
      difficulty: 10,
    },
  ];

  const arr3 = [
    {
      id: 'todo-1',
      text: 'Finishing test',
      isCompleted: false,
      difficulty: 5,
    },
    {
      id: 'todo-2',
      text: 'Design landing page',
      isCompleted: true,
      difficulty: 8,
    },
    {
      id: 'todo-3',
      text: 'Deploy on AWS',
      isCompleted: true,
      difficulty: 10,
    },
  ];

  it('should return an array', () => {
    const mergedArr = mergeTwoArraysById(arr1, arr2);
    expect(Array.isArray(mergedArr)).toEqual(true);
  });

  it('should return an empty array when no record matched', () => {
    const mergedArr = mergeTwoArraysById([], arr2);
    expect(mergedArr).toEqual([]);
  });

  it('should merge 2 arrays based on matched id of object', () => {
    const mergedArr = mergeTwoArraysById(arr1, arr2);
    expect(mergedArr).toEqual(arr3);
  });
});
