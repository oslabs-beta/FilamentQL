// parseClientFilamentQuery.js
const parseClientFilamentQuery = (query) => {
  let index = 0;
  let newQuery = '';
  const cacheData = {};
  let current = cacheData;
  let bracketCount = 0;
  const tempTypes = [];
  let variableForFilter;
  const tempTypesForCacheData = [];
  let tempCacheObject = {};
  let totalTypes = 0;
  const charFindRegex = /[a-zA-Z]/;
  let keyString = '';
  let inputObject = '';
  let holdVarString = '';
  let variableTypeMatch = '';
  let variableAffectedArray = null;
  let searchLimiter = 1;
  let typeNeedsAdding;

  const foundBracketOrQ = findFirstLetterOrBracket()

  if (foundBracketOrQ === 'q') {
    parseTheWordQuery()
    parseIfNameOrVariable()
    parseOpeningBracket()
  }
  findNextCharacterAndParse()
}
// ---------------------------

// findNextCharacter.js
const findNextCharacterAndParse = () => {
  if (bracketCount === 0) return;
  eatWhiteSpace();
  createKeyString();
  addClosingBracketIfFound()
  if (isFinalBracket) return true;
  findOpeningCurlyBracketAfterField();

  if (currElementIsOpeningBracket() && bracketCount === 1 && !variableTypeMatch) {

    getFromCacheOrAddToQuery();
  } else if (
    currElementIsOpeningBracket() &&
    bracketCount !== 1 &&
    !variableTypeMatch
  ) {
    getFromTCOAndNestNewData();
  } else if (
    query[index] === '{' &&
    bracketCount === 1 &&
    variableTypeMatch
  ) {
    filterCachePropertyByVariable();
  } else if (
    query[index] === '{' &&
    bracketCount !== 1 &&
    variableTypeMatch
  ) {
    filterTCOPropertyByVariable();
  } else if (keyString) {
    fieldsInCacheOrNot();
  }

  index += 1;
  findNextCharacterAndParse();
}

const fieldsInCacheOrNot = () => {
  if (tempCacheObject[keyString.trim()]) {
    addStoredTypesToReturnedDataFromCache();
  } else if (!tempCacheObject[keyString.trim()]) {
    addFieldToQueryString();
  }
}

const filterTCOPropertyByVariable = () => {
  if (tempCacheObject[variableTypeMatch.trim()]) {
    tempTypes.push(variableTypeMatch);
    typeNeedsAdding = true;
    variableAffectedObject = tempCacheObject[variableTypeMatch.trim()];
    let variableKey = Object.keys(inputObject);
    tempArray = variableAffectedObject.filter((obj) => {
      return obj[variableKey[0]] === inputObject[variableKey[0]];
    });
    tempCacheObject = tempArray[0];
  } else {
    totalTypes += 1;
    newQuery += keyString + variableTypeMatch + ' {' + ' id ';
  }
}

const filterCachePropertyByVariable = () => {
  if (sessionStorage.getItem(keyString.trim())) {
    let tempString = sessionStorage.getItem(keyString.trim());

    variableAffectedArray = JSON.parse(tempString);
    let variableKey = Object.keys(inputObject);

    let tempArray = variableAffectedArray.filter((obj) => {
      return obj[variableKey[0]] === inputObject[variableKey[0]];
    });

    tempCacheObject = tempArray[0];
    tempTypes.push(variableTypeMatch);
    typeNeedsAdding = true;

    keyString = '';
  } else {
    totalTypes += 1;
    newQuery += keyString + variableTypeMatch + ' {' + ' id ';
    keyString = '';
  }
}


const getFromTCOAndNestNewData = () => {
  if (
    tempCacheObject[keyString.trim()] &&
    tempCacheObject[keyString.trim()][0]
  ) {
    tempCacheObject = tempCacheObject[keyString.trim()][0];
    tempTypes.push(keyString);
    typeNeedsAdding = true;

    keyString = '';
  } else {
    totalTypes += 1;
    newQuery += keyString + ' {' + ' id ';
    keyString = '';
    bracketCount += 1;
  }
}

const getFromCacheOrAddToQuery = () => {
  if (sessionStorage.getItem(keyString.trim())) {
    let tempString = sessionStorage.getItem(keyString.trim());
    tempCacheObject = JSON.parse(tempString)[0];
    tempTypes.push(keyString);
    typeNeedsAdding = true;
    keyString = '';
  } else {
    totalTypes += 1;
    newQuery += keyString + ' {' + ' id ';
    keyString = '';
    bracketCount += 1;
  }
}

const findOpeningCurlyBracketAfterField = () => {
  while (currElementIsntOpeningBracket() && searchLimiter > 0) {
    index += 1;
    searchLimiter -= 1;
  }
  searchLimiter = 1;
}

const addClosingBracket = () => {
  let isFinalBracket = false;
  if (currElementIsClosingBracket()) {
    if (bracketCount) {
      newQuery += '} ';
      totalTypes -= 1;
      tempCacheObject = {};
      bracketCount -= 1;
    }

    if (bracketCount === 0) {
      isFinalBracket = true;
      return isFinalBracket;
    }

    index += 1;
  }

  return isFinalBracket;
}


const createKeyString = () => {
  if (currElementIsAChar()) {
    while (currElementIsntASpace()) {
      if (query[index] === '(') {
        parseAndHoldVarLocation();
        break;
      }

      addElementAndIncrementIndex()
    }
  }
}

function parseAndHoldVarLocation() {
  variableTypeMatch = keyString;
  variableForFilter = keyString;

  while (query[index] !== ')') {
    holdVarString += query[index];
    index += 1;
  }

  holdVarString += query[index];
  index += 1;
}

const eatWhiteSpace = () => {
  while (query[index] === ' ' || query[index] === '\n') {
    index += 1;
  }
}
// --------------------------

// helperFunctions.js

const currElementIsClosingBracket = () => {
  return query[index] === '}';
}

const currElementIsntASpace = () => {
  return query[index] !== ' ';
}

const addElementAndIncrementIndex = () => {
  newQuery += query[index];
  index += 1;
}

const parseOpeningBracket = () => {
  if (currElementIsOpeningBracket()) {
    newQuery += query[index] + ' ';
    index += 1;
    bracketCount += 1;
  }
}

const currElementIsOpeningBracket = () => {
  return query[index] === '{';
}

const currElementIsntOpeningBracket = () => {
  return query[index] !== '{';
}

const currElementIsASpace = () => {
  return query[index] === ' '
}

const currElementIsAChar = () => {
  return query[index].match(charFindRegex)
}
// -----------------

// parseNamesAndVariables.js
const parseIfNameOrVariable = () => {

  if (currElementIsAChar()) {
    parseName();

    if (currElementIsASpace()) {
      index += 1;
    } else {
      return parseVariable();
    }
  }
}

function parseName() {
  while (query[index] !== '(' || /\s/.test(query[index])) {
    addElementAndIncrementIndex()
  }
}

function parseVariable() {
  let inputObjectString = '';
  while (currElementIsntOpeningBracket()) {
    addElementAndIncrementIndex()
  }

  while (query[index] !== '}') {
    inputObjectString += query[index];
    addElementAndIncrementIndex()
  }

  inputObjectString += query[index];
  newQuery += query[index];
  inputObject = JSON.parse(inputObjectString);

  while (query[index] !== ')') {
    addElementAndIncrementIndex()
  }

  newQuery += query[index];
  index += 2;
}

const parseTheWordQuery = () => {
  while (query[index] !== ' ') {
    addElementAndIncrementIndex()
  }
  addElementAndIncrementIndex()
}

const findFirstLetterOrBracket = () => {
  let foundBracketOrQ = 'q';

  while (query[index] !== 'q') {
    if (currElementIsOpeningBracket()) {
      parseOpeningBracket()
      foundBracketOrQ = 'bracket';
      break;
    }

    index += 1;
  }

  return foundBracketOrQ;
}

export default parseClientFilamentQuery


// ----------------------


// const parseClientFilamentQuery = (query) => {
//   let index = 0;
//   let newQuery = '';
//   const cacheData = {};
//   let current = cacheData;
//   let bracketCount = 0;
//   const tempTypes = [];
//   let variableForFilter;
//   const tempTypesForCacheData = [];
//   let tempCacheObject = {};
//   let totalTypes = 0;
//   const charFindRegex = /[a-zA-Z]/;
//   let keyString = '';
//   let inputObject = '';
//   let holdVarString = '';
//   let variableTypeMatch = '';
//   let variableAffectedArray = null;
//   let searchLimiter = 1;
//   let typeNeedsAdding;

//   skipFirstWord();
//   findNextCharacter();

//   function findNextCharacter() {
//     if (bracketCount === 0) return;
//     eatWhiteSpace();

//     createKeyString();

//     if (addClosingBracket()) return true;

//     findOpeningCurlyBracketAfterField();

//     if (query[index] === '{' && bracketCount === 1 && !variableTypeMatch) {

//       getFromCacheOrAddToQuery();
//     } else if (
//       query[index] === '{' &&
//       bracketCount !== 1 &&
//       !variableTypeMatch
//     ) {
//       getFromTCOAndNestNewData();
//     } else if (
//       query[index] === '{' &&
//       bracketCount === 1 &&
//       variableTypeMatch
//     ) {
//       filterCachePropertyByVariable();
//     } else if (
//       query[index] === '{' &&
//       bracketCount !== 1 &&
//       variableTypeMatch
//     ) {
//       filterTCOPropertyByVariable();
//     } else if (keyString) {
//       fieldsInCacheOrNot();
//     }

//     index += 1;
//     findNextCharacter();
//   }

//   function parseVariable() {
//     while (query[index] !== '{') {
//       newQuery += query[index];
//       index += 1;
//     }

//     while (query[index] !== '}') {
//       inputObject += query[index];
//       newQuery += query[index];
//       index += 1;
//     }

//     inputObject += query[index];
//     newQuery += query[index];
//     inputObject = JSON.parse(inputObject);

//     while (query[index] !== ')') {
//       newQuery += query[index];
//       index += 1;
//     }

//     newQuery += query[index];

//     index += 2;
//   }

//   function parseName() {
//     while (query[index] !== '(' || /\s/.test(query[index])) {
//       newQuery += query[index];
//       index += 1;
//     }
//   }

//   function skipFirstWord() {
//     while (query[index] !== 'q') {
//       if (query[index] === '{') {
//         newQuery += query[index] + ' ';
//         index += 1;
//         bracketCount += 1;
//         return;
//       }
//       index += 1;
//     }

//     while (query[index] !== ' ') {
//       newQuery += query[index];
//       index += 1;
//     }
//     newQuery += query[index];
//     index += 1;

//     if (query[index].match(charFindRegex)) {
//       parseName();

//       if (query[index] === ' ') {
//         index += 1;
//       } else {
//         parseVariable();
//       }
//     }

//     if (query[index] === '{') {
//       newQuery += query[index] + ' ';
//       index += 1;
//       bracketCount += 1;
//     }
//   }

//   function eatWhiteSpace() {
//     while (query[index] === ' ' || query[index] === '\n') {
//       index += 1;
//     }
//   }

//   function getFromCacheOrAddToQuery() {
//     if (sessionStorage.getItem(keyString.trim())) {
//       let tempString = sessionStorage.getItem(keyString.trim());
//       tempCacheObject = JSON.parse(tempString)[0];
//       tempTypes.push(keyString);
//       typeNeedsAdding = true;
//       keyString = '';
//     } else {
//       totalTypes += 1;
//       newQuery += keyString + ' {' + ' id ';
//       keyString = '';
//       bracketCount += 1;
//     }
//   }

//   function getFromTCOAndNestNewData() {
//     if (
//       tempCacheObject[keyString.trim()] &&
//       tempCacheObject[keyString.trim()][0]
//     ) {
//       tempCacheObject = tempCacheObject[keyString.trim()][0];
//       tempTypes.push(keyString);
//       typeNeedsAdding = true;

//       keyString = '';
//     } else {
//       totalTypes += 1;
//       newQuery += keyString + ' {' + ' id ';
//       keyString = '';
//       bracketCount += 1;
//     }
//   }

//   function filterTCOPropertyByVariable() {
//     if (tempCacheObject[variableTypeMatch.trim()]) {
//       tempTypes.push(variableTypeMatch);
//       typeNeedsAdding = true;
//       variableAffectedObject = tempCacheObject[variableTypeMatch.trim()];
//       let variableKey = Object.keys(inputObject);
//       tempArray = variableAffectedObject.filter((obj) => {
//         return obj[variableKey[0]] === inputObject[variableKey[0]];
//       });
//       tempCacheObject = tempArray[0];
//     } else {
//       totalTypes += 1;
//       newQuery += keyString + variableTypeMatch + ' {' + ' id ';
//     }
//   }

//   function findOpeningCurlyBracketAfterField() {
//     while (query[index] !== '{' && searchLimiter > 0) {
//       index += 1;
//       searchLimiter -= 1;
//     }
//     searchLimiter = 1;
//   }

//   function addClosingBracket() {
//     if (query[index] === '}') {
//       if (bracketCount) {
//         newQuery += '} ';
//         totalTypes -= 1;
//         tempCacheObject = {};
//         bracketCount -= 1;
//       }

//       if (bracketCount === 0) {
//         return true;
//       }

//       index += 1;
//     }

//   }

//   function parseAndHoldVarLocation() {
//     variableTypeMatch = keyString;
//     variableForFilter = keyString;

//     while (query[index] !== ')') {
//       holdVarString += query[index];
//       index += 1;
//     }

//     holdVarString += query[index];
//     index += 1;
//   }
//   function filterCachePropertyByVariable() {
//     if (sessionStorage.getItem(keyString.trim())) {
//       let tempString = sessionStorage.getItem(keyString.trim());

//       variableAffectedArray = JSON.parse(tempString);
//       let variableKey = Object.keys(inputObject);

//       let tempArray = variableAffectedArray.filter((obj) => {
//         return obj[variableKey[0]] === inputObject[variableKey[0]];
//       });

//       tempCacheObject = tempArray[0];
//       tempTypes.push(variableTypeMatch);
//       typeNeedsAdding = true;

//       keyString = '';
//     } else {
//       totalTypes += 1;
//       newQuery += keyString + variableTypeMatch + ' {' + ' id ';
//       keyString = '';
//     }
//   }

//   function addStoredTypesToReturnedDataFromCache() {
//     tempTypes.forEach((type) => {
//       tempTypesForCacheData.push(type.trim());
//     });
//     addTypes();
//   }

//   function addTypes() {
//     if (keyString.trim() === 'id') {
//       addFieldToQueryString();
//       keyString = 'id';
//     }
//     console.log(keyString);
//     let tempCacheData = {};

//     let currentType = tempTypesForCacheData.shift();

//     let tempTypeString = sessionStorage.getItem(currentType);

//     tempCacheData[currentType] = JSON.parse(tempTypeString);

//     let dataFromCacheArr = tempCacheData[currentType];

//     if (!tempTypesForCacheData.length) {
//       if (variableForFilter && variableForFilter === currentType) {
//         let variableKey = Object.keys(inputObject);

//         dataFromCacheArr = dataFromCacheArr.filter((obj) => {
//           return obj[variableKey[0]] === inputObject[variableKey[0]];
//         });
//       }

//       if (!cacheData[currentType]) {
//         cacheData[currentType] = Array.from(
//           { length: dataFromCacheArr.length },
//           (i) => (i = {})
//         );
//         let cacheDataArr = cacheData[currentType];
//         current = addFields(currentType, dataFromCacheArr, cacheDataArr);
//       } else {
//         let cacheDataArr = current;
//         current = addFields(currentType, dataFromCacheArr, cacheDataArr);
//       }
//     } else {
//       const cacheDataArr = current;
//       current = addNestedFields(currentType, dataFromCacheArr, cacheDataArr);

//       function addNestedFields(currentType, dataFromCacheArr, cacheDataArr) {
//         const newCacheDataArr = [];

//         for (let i = 0; i < dataFromCacheArr.length; i += 1) {
//           if (variableForFilter && variableForFilter === currentType) {
//             let variableKey = Object.keys(inputObject);

//             dataFromCacheArr = dataFromCacheArr.filter((obj) => {
//               return obj[variableKey[0]] === inputObject[variableKey[0]];
//             });
//           }
//           let tempData = dataFromCacheArr[i];
//           let data = cacheDataArr[i];

//           if (tempTypesForCacheData.length) {
//             currentType = tempTypesForCacheData.shift();
//             if (data[currentType]) {
//               const returnedArr = addNestedFields(
//                 currentType,
//                 tempData[currentType],
//                 data[currentType]
//               );
//               newCacheDataArr.push(returnedArr);
//               tempTypesForCacheData.unshift(currentType);
//             } else {
//               data[currentType] = Array.from(
//                 { length: dataFromCacheArr.length },
//                 (i) => (i = {})
//               );
//               const returnedArr = addNestedFields(
//                 currentType,
//                 tempData[currentType],
//                 data[currentType]
//               );
//               newCacheDataArr.push(returnedArr);
//               tempTypesForCacheData.unshift(currentType);
//             }
//           } else {
//             data[keyString.trim()] = tempData[keyString.trim()];
//             newCacheDataArr.push(data);
//           }
//         }
//         return newCacheDataArr;
//       }
//     }
//     keyString = '';
//   }

//   function addFields(currentType, dataFromCacheArr, cacheDataArr) {
//     const newCacheDataArr = [];
//     for (let i = 0; i < dataFromCacheArr.length; i += 1) {
//       let tempData = dataFromCacheArr[i];
//       let data = cacheDataArr[i];

//       data[keyString.trim()] = tempData[keyString.trim()];
//       newCacheDataArr.push(data);
//     }
//     cacheData[currentType] = newCacheDataArr;
//     return newCacheDataArr;
//   }

//   function fieldsInCacheOrNot() {
//     if (tempCacheObject[keyString.trim()]) {
//       addStoredTypesToReturnedDataFromCache();
//     } else if (!tempCacheObject[keyString.trim()]) {
//       addFieldToQueryString();
//     }
//   }

//   function addFieldToQueryString() {
//     if (
//       typeNeedsAdding &&
//       variableTypeMatch === tempTypes[tempTypes.length - 1]
//     ) {
//       newQuery += tempTypes[tempTypes.length - 1];
//       newQuery += holdVarString;
//       newQuery += ' {' + ' id ';
//       bracketCount += 1;
//       totalTypes += 1;
//       holdVarString = '';
//       variableTypeMatch = '';
//       typeNeedsAdding = false;
//     } else if (typeNeedsAdding) {
//       newQuery += tempTypes[tempTypes.length - 1] + ' {' + ' id ';
//       totalTypes += 1;
//       bracketCount += 1;
//       typeNeedsAdding = false;
//     } else if (keyString.trim() !== 'id') {
//       newQuery += keyString;
//       keyString = '';
//     }

//     keyString = '';

//   }

//   function createKeyString() {
//     if (query[index].match(charFindRegex)) {
//       while (query[index] !== ' ') {
//         if (query[index] === '(') {
//           parseAndHoldVarLocation();
//           break;
//         }

//         keyString += query[index];

//         index += 1;
//       }
//     }
//   }



//   return [newQuery, cacheData];
// };

// export default parseClientFilamentQuery;
