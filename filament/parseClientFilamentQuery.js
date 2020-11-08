// parseClientFilamentQuery.js
function parseClientFilamentQuery(query) {
  const cacheData = {};
  const tempTypes = [];
  const tempTypesForCacheData = [];
  const charFindRegex = /[a-zA-Z]/;
  let index = 0;
  let newQuery = '';
  let current = cacheData;
  let bracketCount = 0;
  let variableForFilter;
  let tempCacheObject = {};
  let totalTypes = 0;
  let keyString = '';
  let inputObject = '';
  let holdVarString = '';
  let variableTypeMatch = '';
  let variableAffectedArray = null;
  let searchLimiter = 1;
  let typeNeedsAdding;

  const foundBracketOrQ = findFirstLetterOrBracket();

  if (foundBracketOrQ === 'q') {
    parseTheWordQuery()
    parseIfNameOrVariable()
    parseOpeningBracket()
  }
  findNextCharacterAndParse()
  return [newQuery, cacheData];

  function findNextCharacterAndParse() {
    if (bracketCount === 0) return;
    eatWhiteSpace();
    createKeyString();
    const isFinalBracket = addClosingBracketIfFound()
    if (isFinalBracket) return true;
    findOpeningCurlyBracketAfterField();

    if (
      currElementIsOpeningBracket() &&
      bracketCountIsOne() &&
      !variableTypeMatch
    ) {
      getFromCacheOrAddToQuery();
    } else if (
      currElementIsOpeningBracket() &&
      bracketCountNotOne() &&
      !variableTypeMatch
    ) {
      getFromTCOAndNestNewData();
    } else if (
      currElementIsOpeningBracket() &&
      bracketCountIsOne() &&
      variableTypeMatch
    ) {
      filterCachePropertyByVariable();
    } else if (
      currElementIsOpeningBracket() &&
      bracketCountNotOne() &&
      variableTypeMatch
    ) {
      filterTCOPropertyByVariable();
    } else if (keyString) {
      fieldsInCacheOrNot();
    }

    index += 1;
    findNextCharacterAndParse();
  }

  function fieldsInCacheOrNot() {
    if (tempCacheObject[keyString.trim()]) {
      addStoredTypesToReturnedDataFromCache();
    } else if (!tempCacheObject[keyString.trim()]) {
      addFieldToQueryString();
    }
  }

  function addStoredTypesToReturnedDataFromCache() {
    const tempTypesForCacheData = []
    tempTypes.forEach((type) => {
      tempTypesForCacheData.push(type.trim());
    });
    addTypesAndFieldsToCacheObject();
  }

  function addTypesAndFieldsToCacheObject() {
    if (keyString.trim() === 'id') {
      addFieldToQueryString();
      keyString = 'id';
    }
    let tempCacheData = {};
    let currentType = tempTypesForCacheData.shift();
    let tempTypeString = sessionStorage.getItem(currentType);
    tempCacheData[currentType] = JSON.parse(tempTypeString);
    let dataFromCacheArr = tempCacheData[currentType];
    console.log(dataFromCacheArr)
    if (!tempTypesForCacheData.length) {
      if (variableForFilter && variableForFilter === currentType) {
        let variableKey = Object.keys(inputObject);

        dataFromCacheArr = dataFromCacheArr.filter((obj) => {
          return obj[variableKey[0]] === inputObject[variableKey[0]];
        });
      }

      if (!cacheData[currentType]) {
        cacheData[currentType] = Array.from(
          { length: dataFromCacheArr.length },
          (i) => (i = {})
        );
        let cacheDataArr = cacheData[currentType];
        current = addFields(currentType, dataFromCacheArr, cacheDataArr);
      } else {
        let cacheDataArr = current;
        current = addFields(currentType, dataFromCacheArr, cacheDataArr);
      }
    } else {
      const cacheDataArr = current;
      current = addNestedFields(currentType, dataFromCacheArr, cacheDataArr);
    }
    keyString = '';
  }

  function addFields() {
    const newCacheDataArr = [];
    for (let i = 0; i < dataFromCacheArr.length; i += 1) {
      let tempData = dataFromCacheArr[i];
      let data = cacheDataArr[i];

      data[keyString.trim()] = tempData[keyString.trim()];
      newCacheDataArr.push(data);
    }
    cacheData[currentType] = newCacheDataArr;
    return newCacheDataArr;
  }

  function addNestedFields(currentType, dataFromCacheArr, cacheDataArr) {
    const newCacheDataArr = [];

    for (let i = 0; i < dataFromCacheArr.length; i += 1) {
      if (variableForFilter && variableForFilter === currentType) {
        let variableKey = Object.keys(inputObject);

        dataFromCacheArr = dataFromCacheArr.filter((obj) => {
          return obj[variableKey[0]] === inputObject[variableKey[0]];
        });
      }
      let tempData = dataFromCacheArr[i];
      let data = cacheDataArr[i];

      if (tempTypesForCacheData.length) {
        currentType = tempTypesForCacheData.shift();
        if (data[currentType]) {
          const returnedArr = addNestedFields(
            currentType,
            tempData[currentType],
            data[currentType]
          );
          newCacheDataArr.push(returnedArr);
          tempTypesForCacheData.unshift(currentType);
        } else {
          data[currentType] = Array.from(
            { length: dataFromCacheArr.length },
            (i) => (i = {})
          );
          const returnedArr = addNestedFields(
            currentType,
            tempData[currentType],
            data[currentType]
          );
          newCacheDataArr.push(returnedArr);
          tempTypesForCacheData.unshift(currentType);
        }
      } else {
        data[keyString.trim()] = tempData[keyString.trim()];
        newCacheDataArr.push(data);
      }
    }
    return newCacheDataArr;
  }


  function addFieldToQueryString() {
    if (
      typeNeedsAdding &&
      variableTypeMatch === tempTypes[tempTypes.length - 1]
    ) {
      newQuery += tempTypes[tempTypes.length - 1];
      newQuery += holdVarString;
      newQuery += ' {' + ' id ';
      bracketCount += 1;
      totalTypes += 1;
      holdVarString = '';
      variableTypeMatch = '';
      typeNeedsAdding = false;
    } else if (typeNeedsAdding) {
      newQuery += tempTypes[tempTypes.length - 1] + ' {' + ' id ';
      totalTypes += 1;
      bracketCount += 1;
      typeNeedsAdding = false;
    } else if (keyString.trim() !== 'id') {
      newQuery += keyString;
      keyString = '';
    }

    keyString = '';
  }

  function filterTCOPropertyByVariable() {
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

  function filterCachePropertyByVariable() {
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


  function getFromTCOAndNestNewData() {
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

  function getFromCacheOrAddToQuery() {
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

  function findOpeningCurlyBracketAfterField() {
    while (currElementIsntOpeningBracket() && searchLimiter > 0) {
      index += 1;
      searchLimiter -= 1;
    }
    searchLimiter = 1;
  }

  function addClosingBracketIfFound() {
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


  function createKeyString() {
    if (currElementIsAChar()) {
      while (currElementIsntASpace()) {
        if (query[index] === '(') {
          parseAndHoldVarLocation();
          break;
        }


        keyString += query[index];
        index += 1;
        // addElementAndIncrementIndex()
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

  function eatWhiteSpace() {
    while (query[index] === ' ' || query[index] === '\n') {
      index += 1;
    }
  }
  // --------------------------

  // helperFunctions.js
  function bracketCountNotOne() {
    return bracketCount !== 1;
  }

  function bracketCountIsOne() {
    return bracketCount === 1
  }

  function currElementIsClosingBracket() {
    return query[index] === '}';
  }

  function currElementIsntASpace() {
    return query[index] !== ' ';
  }

  function addElementAndIncrementIndex() {
    newQuery += query[index];
    index += 1;
  }

  function parseOpeningBracket() {
    if (currElementIsOpeningBracket()) {
      newQuery += query[index] + ' ';
      index += 1;
      bracketCount += 1;
    }
  }

  function currElementIsOpeningBracket() {
    return query[index] === '{';
  }

  function currElementIsntOpeningBracket() {
    return query[index] !== '{';
  }

  function currElementIsASpace() {
    return query[index] === ' '
  }

  function currElementIsAChar() {
    return query[index].match(charFindRegex)
  }
  // -----------------

  // parseNamesAndVariables.js
  function parseIfNameOrVariable() {

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

  function parseTheWordQuery() {
    while (query[index] !== ' ') {
      addElementAndIncrementIndex()
    }
    addElementAndIncrementIndex()
  }

  function findFirstLetterOrBracket() {
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
};
// ---------------------------

// findNextCharacter.js

export default parseClientFilamentQuery


