export function parseFilamentQuery(query) {
  let index = 0;
  let newQuery = '';
  const cacheData = {};
  let current = cacheData;
  let bracketCount = 0;
  const tempTypes = [];
  const tempTypesForCacheData = [];
  let tempCacheObject = {};
  let totalTypes = 0;
  const charFindRegex = /[a-zA-Z]/;
  let inputObject = '';
  let holdVarString = '';
  let variableTypeMatch = '';
  let variableAffectedArray = null;
  let searchLimiter = 1;
  let keyString = '';
  const previousTypesArr = [];
  skipFirstWord();
  findNextCharacter();
  // newQuery += '}'
  function findNextCharacter() {
    // base case
    if (bracketCount === 0) return;
    // skips any whitespace
    eatWhiteSpace();
    // holds value of the 'key', either it is a Type or a Field
    createKeyString();
    // this checks for ending brackets and adds one according to how many needed fields there have been
    // it also finds the next character after placing the closing
    if (addClosingBracket()) return true;
    // advances 'index' until it finds a '{' immediately after finding a field
    findOpeningCurlyBracketAfterField();
    // each if/else if logic is deciding where to look for the data, cache or the tempCacheObject
    // temp cache object gets reset and more nested as we find more types within the parent object
    // variableTypeMatch checks for whether we found a place where our variable is used.
    if (query[index] === '{' && bracketCount === 1 && !variableTypeMatch) {
      // if we find our 'keyString' in the cache, we retrieve that object
      // if we dont find it, we  know the data isnt there
      // we then add it to our string to retrieve it from our DB
      getFromCacheOrAddToQuery();
      // here we know we have to check the tempCacheObject
      // we have already retrieved data from cache
    } else if (
      query[index] === '{' &&
      bracketCount !== 1 &&
      !variableTypeMatch
    ) {
      // checks Temp Cache Object for data,
      // adds to our query string if it finds none, nests new data if we find an object that matches the keyString
      // we add to types which will affect how many closing '}' we end up adding
      getFromTCOAndNestNewData();
    } else if (
      query[index] === '{' &&
      bracketCount === 1 &&
      variableTypeMatch
    ) {
      // filter the cache property object using the variable
      filterCachePropertyByVariable();
    } else if (
      query[index] === '{' &&
      bracketCount !== 1 &&
      variableTypeMatch
    ) {
      // filter the tempCacheObjet by the variable
      filterTCOPropertyByVariable();
    } else if (keyString) {
      // we have found a field, check if tempCacheObject has that property
      // if either our cache or tempCacheObject contian our field
      fieldsInCacheOrNot();
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
      if (query[index] === '{') {
        newQuery += query[index];
        index += 1;
        bracketCount += 1;
        return;
      }
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
    if (query[index] === '{') {
      newQuery += query[index];
      index += 1;
      bracketCount += 1;
    }
  }
  function eatWhiteSpace() {
    // query[index] starts out on a space or linebreak
    while (query[index] === ' ' || query[index] === '\n') {
      index += 1;
    }
    // next query[index] will be a character
  }
  // if we find our 'keyString' in the cache, we retrieve that object
  // if we dont find it, we  know the data isnt there
  // we then add it to our string to retrieve it from our DB
  function getFromCacheOrAddToQuery() {
    if (sessionStorage.getItem(keyString.trim())) {
      const tempString = sessionStorage.getItem(keyString.trim());
      tempCacheObject = JSON.parse(tempString)[0];
      // We want to add this key to our  returned cacheObject because if we are looking for it
      // no matter what we want the ID stored there.
      // no matter what we are adding this property to the final cache Object because we need the ID no matter what
      tempTypes.push(keyString);
      keyString = '';
    } else {
      // ??NOT SURE IF THIS MATTERS?????????????????
      totalTypes += 1;
      newQuery += keyString + '{' + 'id ';
      keyString = '';
      bracketCount += 1;
    }
  }
  function getFromTCOAndNestNewData() {
    if (
      tempCacheObject[keyString.trim()] &&
      tempCacheObject[keyString.trim()][0]
    ) {
      tempCacheObject = tempCacheObject[keyString.trim()][0];
      tempTypes.push(keyString);
      keyString = '';
    } else {
      totalTypes += 1;
      newQuery += keyString + '{' + 'id ';
      keyString = '';
      bracketCount += 1;
    }
  }
  function filterTCOPropertyByVariable() {
    if (tempCacheObject[variableTypeMatch.trim()]) {
      tempTypes.push(variableTypeMatch);
      variableAffectedObject = tempCacheObject[variableTypeMatch.trim()];
      let variableKey = Object.keys(inputObject);
      tempArray = variableAffectedObject.filter((obj) => {
        return obj[variableKey[0]] === inputObject[variableKey[0]];
      });
      tempCacheObject = tempArray[0];
      variableTypeMatch = '';
    } else {
      totalTypes += 1;
      newQuery += keyString + variableTypeMatch + '{' + 'id ';
      variableTypeMatch = '';
    }
  }
  function findOpeningCurlyBracketAfterField() {
    // advances 'index' until it finds a '{' immediately after finding a field
    while (query[index] !== '{' && searchLimiter > 0) {
      index += 1;
      searchLimiter -= 1;
    }
    searchLimiter = 1;
  }
  function addClosingBracket() {
    // here we add an ending bracket to the queryString
    // we check the number of totalTypes
    // this makes sure we aren't adding a bracket for a Type that we have removed
    // find the next character
    if (query[index] === '}') {
      console.log(bracketCount);
      if (bracketCount) {
        newQuery += '}';
        // deal with total types, remove, use bracket Count
        totalTypes -= 1;
        // THIS WILL CHANGE !!!!!!!!! GO BACK INTO PREVIOUSLY NESTED OBJECT
        tempCacheObject = {};
        bracketCount -= 1;
      }
      if (bracketCount === 0) {
        return true;
      }
      index += 1;
      // findNextCharacter()
    }
  }
  function parseAndHoldVarLocation() {
    // we've found where we are 'using' the variable, where we are filtering
    // 'variableTypeMatch' will be used later to query the database and filter the correct 'key'
    // holdVarString holds on to the variable string from '(' to ')'.
    // We only want to add 'holdVarString' if its 'keyString' is needed. (what preceeds it)
    variableTypeMatch = keyString;
    while (query[index] !== ')') {
      holdVarString += query[index];
      index += 1;
    }
    holdVarString += query[index];
    index += 1;
  }
  // filter the cache property object using the variable
  function filterCachePropertyByVariable() {
    if (sessionStorage.getItem(keyString.trim())) {
      variableAffectedString = sessionStorage.getItem(keyString.trim());
      variableAffectedArray = JSON.parse(variableAffectedString);
      let variableKey = Object.keys(inputObject);
      let tempArray = variableAffectedArray.filter((obj) => {
        return obj[variableKey[0]] === inputObject[variableKey[0]];
      });
      tempCacheObject = tempArray[0];
      tempTypes.push(variableTypeMatch);
      variableTypeMatch = '';
      keyString = '';
    } else {
      totalTypes += 1;
      newQuery += keyString + variableTypeMatch + '{' + 'id ';
      variableTypeMatch = '';
      keyString = '';
    }
  }
  function addStoredTypesToReturnedDataFromCache() {
    tempTypes.forEach((type) => {
      tempTypesForCacheData.push(type);
    });
    addTypes();
  }
  // adds data from cache to our cacheObject which we will eventually return
  function addTypes() {
    if (keyString.trim() === 'id') {
      addFieldToQueryString();
    }
    tempTypesForCacheData.forEach((type) => {
      // this is a hardcoded solution
      if (cacheData[type]) {
        tempTypesForCacheData.shift();
      } else {
        current[type] = {};
        current = current[type];
        tempTypesForCacheData.shift();
      }
    });
    current[keyString.trim()] = tempCacheObject[keyString.trim()];
    keyString = '';
  }
  function fieldsInCacheOrNot() {
    // THIS IF ELSE NEEDS REFACTORING WHERE THE NEGATIVE GOES FIRST
    if (tempCacheObject[keyString.trim()]) {
      addStoredTypesToReturnedDataFromCache();
      // add logic to know we are officially adding a type to the string because we have found a field missing from the cache
      // if we are within that specific type (looking for fields only) NOT OTHER TYPES
      // only add to bracketCount ONCE!
      // once we find another TYPE, we can change the boolean back
    } else if (!tempCacheObject[keyString.trim()]) {
      addFieldToQueryString();
    }
  }
  function addFieldToQueryString() {
    while (tempTypes.length) {
      if (variableTypeMatch === tempTypes[0]) {
        newQuery += tempTypes.shift();
        newQuery += holdVarString;
        newQuery += '{' + 'id ';
        bracketCount += 1;
        totalTypes += 1;
        holdVarString = '';
      } else {
        newQuery += tempTypes.shift() + '{' + 'id ';
        totalTypes += 1;
        bracketCount += 1;
      }
    }
    if (keyString.trim() !== 'id') {
      newQuery += keyString;
      keyString = '';
    }
  }
  function createKeyString() {
    // If it finds a letter it indicates that it found a Type or a Field
    // it then adds that word as a 'keyString'
    // if it finds a '(' that means we found an input for a variable and we must proceed on
    if (query[index].match(charFindRegex)) {
      while (query[index] !== ' ') {
        if (query[index] === '(') {
          // if its matching 'keyString' is needed, we will add the 'holdVarString' to the query
          parseAndHoldVarLocation();
          break;
        }
        keyString += query[index];
        index += 1;
      }
    }
  }
  return [newQuery, cacheData];
}
