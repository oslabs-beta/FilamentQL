const mergeTwoArraysById = (array1, array2) =>
  array1.map((object1) => {
    const matchedObject = array2.find((object2) => object2.id === object1.id);
    const mergedObject = { ...object1, ...matchedObject };
    return mergedObject;
  });

export default mergeTwoArraysById;
