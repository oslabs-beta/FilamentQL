export function parseFilamentQuery(query) {
  let index = 0;
  let newQuery = '';
  let bracketCount = 0;
  const tempTypes = [];
  const tempTypesForCacheData = [];
  let tempCacheObject = {};
  let totalTypes = 0;
  const charFindRegex = /[a-zA-Z]/;
  let inputObject = '';
  let holdVarString = '';
  let variableTypeMatch = '';
  const cacheData = {};
  let variableAffectedObject = null;
  skipFirstWord();
  // newQuery += '}';
  function findNextCharacter() {
    if (bracketCount === 0) return;
    let keyString = '';
    let typoAdjuster = 2;
    // skipping blank space
    while (query[index] === ' ' || query[index] === '\n') {
      index += 1;
    }
    if (query[index].match(charFindRegex)) {
      while (query[index] !== ' ') {
        if (query[index] === '(') {
          variableTypeMatch = keyString;
          break;
        }
        keyString += query[index];
        index += 1;
      }
    }
    if (query[index] === '(') {
      while (query[index] !== ')') {
        holdVarString += query[index];
        index += 1;
      }
      holdVarString += query[index];
      // variableTypeMatch = keyString
      index += 1;
    }
    if (query[index] === '}') {
      if (totalTypes) {
        newQuery += '}';
        totalTypes -= 1;
        tempCacheObject = {};
      }
      index += 1;
      bracketCount -= 1;
      findNextCharacter();
    }
    // if character is a letter && the char after that word is a '{', then it is a queryType
    while (query[index] !== '{' && typoAdjuster > 0) {
      index += 1;
      typoAdjuster -= 1;
    }
    if (query[index] === '{' && bracketCount === 1 && !variableTypeMatch) {
      if (sessionStorage.getItem(keyString.trim())) {
        const tempCacheString = sessionStorage.getItem(keyString.trim());
        tempCacheObject = JSON.parse(tempCacheString)[0];
        totalTypes += 1;
        tempTypes.push(keyString);
      } else {
        newQuery += keyString + '{';
      }
    } else if (
      query[index] === '{' &&
      bracketCount !== 1 &&
      !variableTypeMatch
    ) {
      totalTypes += 1;
      tempTypes.push(keyString);
      tempCacheObject = tempCacheObject[keyString.trim()][0];
    } else if (
      query[index] === '{' &&
      bracketCount === 1 &&
      variableTypeMatch
    ) {
      if (sessionStorage.getItem(keyString.trim())) {
        const variableAffectedString = sessionStorage.getItem(keyString.trim());
        variableAffectedObject = JSON.parse(variableAffectedString);
        let tempArray = variableAffectedObject.filter((obj) => {
          return obj.id === inputObject.id;
        });
        tempCacheObject = tempArray[0];
        totalTypes += 1;
        tempTypes.push(variableTypeMatch);
        console.log(variableTypeMatch);
        variableTypeMatch = '';
        console.log(variableTypeMatch);
        console.log(tempTypes);
      } else {
        newQuery += keyString + '{';
      }
    } else if (
      query[index] === '{' &&
      bracketCount !== 1 &&
      variableTypeMatch
    ) {
      totalTypes += 1;
      tempTypes.push(variableTypeMatch);
      variableAffectedObject = tempCacheObject[variableTypeMatch.trim()];
      tempArray = variableAffectedObject.filter((obj) => {
        return obj.id === inputObject.id;
      });
      tempCacheObject = tempArray[0];
      variableTypeMatch = '';
    } else {
      // we have found a field, check if tempCacheObject has that property
      if (
        tempCacheObject[keyString.trim()] ||
        tempCacheObject[keyString.trim()] === false ||
        tempCacheObject[keyString.trim()] ||
        typeof tempCacheObject[keyString.trim()] === 'number'
      ) {
        if (tempCacheObject[keyString.trim()]) {
          tempTypes.forEach((type) => {
            tempTypesForCacheData.push(type);
          });
          addTypes();
          function addTypes() {
            for (let i = 0; i < tempTypesForCacheData.length; i += 1) {
              let type = tempTypesForCacheData[i];
              if (cacheData[type]) {
              } else {
                cacheData[type] = {};
                cacheData[type][keyString.trim()] =
                  tempCacheObject[keyString.trim()];
              }
            }
          }
        }
        findNextCharacter();
      } else {
        while (tempTypes.length) {
          if (variableTypeMatch === tempTypes[0]) {
            console.log(newQuery);
            newQuery += tempTypes.shift();
            console.log(tempTypes);
            newQuery += holdVarString;
            newQuery += '{';
            bracketCount += 1;
            totalTypes += 1;
            holdVarString = '';
          } else {
            newQuery += tempTypes.shift() + '{';
            bracketCount += 1;
            totalTypes += 1;
          }
        }
        newQuery += keyString;
        findNextCharacter();
      }
      // if not we add keyString to our newQuery and add a bracket and add the next word
    }
    index += 1;
    // if above is true && bracketCount is 1, then we need to ask the cache for that key
    findNextCharacter();
  }
  function parseVariable() {
    while (query[index] !== '{') {
      newQuery += query[index];
      index += 1;
    }
    while (query[index] !== '}') {
      inputObject += query[index];
      newQuery += query[index];
      index += 1;
    }
    inputObject += query[index];
    newQuery += query[index];
    inputObject = JSON.parse(inputObject);
    while (query[index] !== ')') {
      newQuery += query[index];
      index += 1;
    }
    newQuery += query[index];
    index += 2;
  }
  function parseName() {
    while (query[index] !== '(' || /\s/.test(query[index])) {
      newQuery += query[index];
      index += 1;
    }
  }
  function skipFirstWord() {
    while (query[index] !== 'q') {
      index += 1;
    }
    // parse the word 'query'
    while (query[index] !== ' ') {
      newQuery += query[index];
      index += 1;
    }
    newQuery += query[index];
    index += 1;
    //  parse either the name and or the variable
    if (query[index].match(charFindRegex)) {
      parseName();
      if (query[index] === ' ') {
        index += 1;
      } else {
        parseVariable();
      }
    }
    console.log(query[index]);
    if (query[index] === '{') {
      newQuery += query[index];
      index += 1;
      bracketCount += 1;
    }
    findNextCharacter();
  }
  return [newQuery, cacheData];
}
