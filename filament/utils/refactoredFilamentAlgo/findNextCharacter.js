// findNextCharacter.js
findNextCharacter = () => {
  // not sure if I need this
  if (bracketCount === 0) return;

  eatWhiteSpace()

  let [
    keyString,
    varTypeMatch,
    varForFilter,
    holdVarString
  ] = createKeyStringAndParseVarLocation()

  let [
    bracketCount,
    totalTypes,
    tempCacheObject,
    isFinalBracket
  ] = addClosingBracketIfFound()

  if (isFinalBracket) return true;
  findOpeningCurlyBracketAfterField();

  if (
    query[index] === '{' &&
    bracketCount === 1 &&
    !varTypeMatch
  ) {
    let [
      typeNeedsAdding,
      tempTypes,
      tempCacheObject,
      keyString,
      totalTypes,
      bracketCount
    ] = getFromCacheOrAddToQuery(typeNeedsAdding,
      tempTypes,
      tempCacheObject,
      keyString,
      totalTypes,
      bracketCount);
  } else if (
    query[index] === '{' &&
    bracketCount !== 1 &&
    !varTypeMatch
  ) {

    let [
      tempCacheObject,
      tempTypes,
      typeNeedsAdding,
      keyString,
      totalTypes,
      bracketCount
    ] = getFromTCOAndNestNewData(tempCacheObject,
      tempTypes,
      typeNeedsAdding,
      keyString,
      totalTypes,
      bracketCount);
  } else if (
    query[index] === '{' &&
    bracketCount === 1 &&
    varTypeMatch
  ) {
    let [
      totalTypes,
      keyString,
      tempCacheObject,
      tempTypes,
      typeNeedsAdding,
    ] = filterCachePropertyByVariable(totalTypes,
      keyString,
      tempCacheObject,
      tempTypes,
      typeNeedsAdding);
  } else if (
    query[index] === '{' &&
    bracketCount !== 1 &&
    varTypeMatch
  ) {
    let [
      totalTypes,
      tempCacheObject,
      typeNeedsAdding,
      tempTypes
    ] = filterTCOPropertyByVariable(totalTypes,
      tempCacheObject,
      typeNeedsAdding,
      tempTypes);
  } else if (keyString) {
    let [
      keyString,
      bracketCount,
      totalTypes,
      holdVarString,
      varTypeMatch,
      typeNeedsAdding
    ] = fieldsInCacheOrNot(tempCacheObject,
      tempTypes,
      keyString,
      bracketCount,
      totalTypes,
      holdVarString,
      varTypeMatch,
      typeNeedsAdding);
  }

  index += 1;
  findNextCharacter();
};

const fieldsInCacheOrNot = (tempCacheObject, tempTypes, keyString, bracketCount, totalTypes, holdVarString, varTypeMatch, typeNeedsAdding) => {
  if (tempCacheObject[keyString.trim()]) {
    let keyString = addStoredTypesToReturnedDataFromCache(tempTypes, keyString);
  } else if (!tempCacheObject[keyString.trim()]) {
    let [
      keyString,
      bracketCount,
      totalTypes,
      holdVarString,
      varTypeMatch,
      typeNeedsAdding
    ] = addFieldToQueryString(
      keyString,
      bracketCount,
      totalTypes,
      holdVarString,
      varTypeMatch,
      typeNeedsAdding);
  }

  return [keyString,
    bracketCount,
    totalTypes,
    holdVarString,
    varTypeMatch,
    typeNeedsAdding]
}

function addFieldToQueryString(keyString, bracketCount, totalTypes, holdVarString, varTypeMatch, typeNeedsAdding) {
  if (
    typeNeedsAdding &&
    varTypeMatch === tempTypes[tempTypes.length - 1]
  ) {
    newQuery += tempTypes[tempTypes.length - 1];
    newQuery += holdVarString;
    newQuery += ' {' + ' id ';
    bracketCount += 1;
    totalTypes += 1;
    holdVarString = '';
    varTypeMatch = '';
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

  return [keyString, bracketCount, totalTypes, holdVarString, varTypeMatch, typeNeedsAdding]
}

const addStoredTypesToReturnedDataFromCache = (tempTypes, keyString) => {
  const tempTypesForCacheData = []
  tempTypes.forEach((type) => {
    tempTypesForCacheData.push(type.trim());
  });
  let keyString = addTypesAndFieldsToCacheObject(tempTypesForCacheData, keyString);
}

function addTypesAndFieldsToCacheObject(tempTypesForCacheData, keyString) {
  if (keyString.trim() === 'id') {
    addFieldToQueryString();
    keyString = 'id';
  }
  let tempCacheData = {};
  let currentType = tempTypesForCacheData.shift();
  let tempTypeString = sessionStorage.getItem(currentType);
  tempCacheData[currentType] = JSON.parse(tempTypeString);
  let dataFromCacheArr = tempCacheData[currentType];

  if (!tempTypesForCacheData.length) {
    if (varForFilter && varForFilter === currentType) {
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

  return keyString;
}

function addNestedFields(currentType, dataFromCacheArr, cacheDataArr) {
  const newCacheDataArr = [];

  for (let i = 0; i < dataFromCacheArr.length; i += 1) {
    if (varForFilter && varForFilter === currentType) {
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


const filterTCOPropertyByVariable = (totalTypes, tempCacheObject, typeNeedsAdding, tempTypes) => {
  if (tempCacheObject[varTypeMatch.trim()]) {
    tempTypes.push(varTypeMatch);
    typeNeedsAdding = true;
    let variableAffectedObject = tempCacheObject[varTypeMatch.trim()];
    let variableKey = Object.keys(inputObject);
    let tempArray = variableAffectedObject.filter((obj) => {
      return obj[variableKey[0]] === inputObject[variableKey[0]];
    });
    tempCacheObject = tempArray[0];
  } else {
    totalTypes += 1;
    newQuery += keyString + varTypeMatch + ' {' + ' id ';
  }

  return [
    totalTypes,
    tempCacheObject,
    typeNeedsAdding,
    tempTypes
  ]
}

const filterCachePropertyByVariable = (totalTypes, keyString, tempCacheObject, tempTypes, typeNeedsAdding) => {
  if (sessionStorage.getItem(keyString.trim())) {
    let tempString = sessionStorage.getItem(keyString.trim());

    let variableAffectedArray = JSON.parse(tempString);
    let variableKey = Object.keys(inputObject);

    let tempArray = variableAffectedArray.filter((obj) => {
      return obj[variableKey[0]] === inputObject[variableKey[0]];
    });

    tempCacheObject = tempArray[0];
    tempTypes.push(varTypeMatch);
    typeNeedsAdding = true;
    keyString = '';
  } else {
    totalTypes += 1;
    newQuery += keyString + varTypeMatch + ' {' + ' id ';
    keyString = '';
  }

  return [
    totalTypes,
    keyString,
    tempCacheObject,
    tempTypes,
    typeNeedsAdding,
  ]
}


const getFromTCOAndNestNewData = (tempCacheObject, tempTypes, typeNeedsAdding, keyString, totalTypes, bracketCount) => {
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

  return [
    tempCacheObject,
    tempTypes,
    typeNeedsAdding,
    keyString,
    totalTypes,
    bracketCount
  ]
}

const getFromCacheOrAddToQuery = (typeNeedsAdding, tempTypes, tempCacheObject, keyString, totalTypes, bracketCount) => {
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

  return [
    typeNeedsAdding,
    tempTypes,
    tempCacheObject,
    keyString,
    totalTypes,
    bracketCount
  ]
}

const findOpeningCurlyBracketAfterField = () => {
  let searchLimiter = 1;
  while (query[index] !== '{' && searchLimiter > 0) {
    index += 1;
    searchLimiter -= 1;
  }
}

const addClosingBracket = () => {
  let isFinalBracket = false;
  if (query[index] === '}') {
    if (bracketCount) {
      newQuery += '} ';
      totalTypes -= 1;
      tempCacheObject = {};
      bracketCount -= 1;
    }

    if (bracketCount === 0) {
      isFinalBracket = true;
      return [bracketCount, totalTypes, tempCacheObject, isFinalBracket]
    }

    index += 1;
  }

  return [bracketCount, totalTypes, tempCacheObject, isFinalBracket]
}

const createKeyStringAndParseVarLocation = () => {
  const charFindRegex = /[a-zA-Z]/;
  let keyString = '';
  if (query[index].match(charFindRegex)) {
    while (query[index] !== ' ') {
      if (query[index] === '(') {
        const [
          varTypeMatch,
          varForFilter,
          holdVarString
        ] = parseAndHoldVarLocation();
        return
      }

      keyString += query[index];
      index += 1;
    }
  }

  return [keyString, varTypeMatch, varForFilter, holdVarString];
}

function parseAndHoldVarLocation() {
  const varTypeMatch = keyString;
  const varForFilter = keyString;
  let holdVarString = '';

  while (query[index] !== ')') {
    holdVarString += query[index];
    index += 1;
  }

  holdVarString += query[index];
  index += 1;

  return [varTypeMatch, varForFilter, holdVarString]
}

// -----------------