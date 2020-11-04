function serverFilamentQuery(query, cacheObject) {
  let index = 0;
  let newQuery = '';
  const cacheData = {};
  let current = cacheData;
  let bracketCount = 0;
  const tempTypes = []
  let variableForFilter;
  const tempTypesForCacheData = []
  let tempCacheObject = {};
  let totalTypes = 0;
  const charFindRegex = /[a-zA-Z]/;
  let inputObject = '';
  let holdVarString = '';
  let variableTypeMatch = ''
  let variableAffectedArray = null;
  let searchLimiter = 1;
  let keyString = '';
  let typeNeedsAdding;
  let isMatched = true;

  skipFirstWord();
  findNextCharacter();
  // newQuery += '}'

  function findNextCharacter() {
    // base case
    if (bracketCount === 0) return;
    // skips any whitespace
    eatWhiteSpace()
    // holds value of the 'key', either it is a Type or a Field


    // this checks for ending brackets and adds one according to how many needed fields there have been
    // it also finds the next character after placing the closing
    createKeyString()

    if (addClosingBracket()) return true;


    // advances 'index' until it finds a '{' immediately after finding a field
    findOpeningCurlyBracketAfterField()
    // each if/else if logic is deciding where to look for the data, cache or the tempCacheObject
    // temp cache object gets reset and more nested as we find more types within the parent object
    // variableTypeMatch checks for whether we found a place where our variable is used.
    if (query[index] === '{' && bracketCount === 1 && !variableTypeMatch) {
      // if we find our 'keyString' in the cache, we retrieve that object
      // if we dont find it, we  know the data isnt there
      // we then add it to our string to retrieve it from our DB
      getFromCacheOrAddToQuery()
      // here we know we have to check the tempCacheObject
      // we have already retrieved data from cache
    } else if (query[index] === '{' && bracketCount !== 1 && !variableTypeMatch) {
      // checks Temp Cache Object for data, 
      // adds to our query string if it finds none, nests new data if we find an object that matches the keyString
      // we add to types which will affect how many closing '}' we end up adding
      getFromTCOAndNestNewData()
    } else if (query[index] === '{' && bracketCount === 1 && variableTypeMatch) {
      // filter the cache property object using the variable
      filterCachePropertyByVariable()
    } else if (query[index] === '{' && bracketCount !== 1 && variableTypeMatch) {
      // filter the tempCacheObjet by the variable
      filterTCOPropertyByVariable()
    } else if (keyString) {
      // we have found a field, check if tempCacheObject has that property
      // if either our cache or tempCacheObject contian our field
      fieldsInCacheOrNot()
    }

    index += 1;
    // if above is true && bracketCount is 1, then we need to ask the cache for that key
    findNextCharacter()
  }


  function parseVariable() {
    while (query[index] !== '{') {
      newQuery += query[index]
      index += 1;
    }

    while (query[index] !== '}') {
      inputObject += query[index]
      newQuery += query[index]
      index += 1;
    }

    inputObject += query[index]
    newQuery += query[index]
    inputObject = JSON.parse(inputObject)

    while (query[index] !== ')') {
      newQuery += query[index]
      index += 1;
    }

    newQuery += query[index]

    index += 2;

  }

  function parseName() {
    while (query[index] !== '(' || /\s/.test(query[index])) {
      newQuery += query[index];
      index += 1;
    }
  }


  function skipFirstWord() {
    // looks for a 'q', which will mean that we found the word 'query'
    // if we find a '{' it means we found a query using the different syntax
    while (query[index] !== 'q') {
      if (query[index] === '{') {
        newQuery += query[index] + ' ';
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
    newQuery += query[index]
    index += 1


    //  parse either the name and or the variable
    if (query[index].match(charFindRegex)) {
      parseName()

      if (query[index] === ' ') {
        index += 1;
      } else {
        parseVariable()

      }
    }

    if (query[index] === '{') {
      newQuery += query[index] + ' ';
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
    if (cacheObject[keyString.trim()]) {

      tempCacheObject = cacheObject[keyString.trim()][0];
      // We want to add this key to our  returned cacheObject because if we are looking for it
      // no matter what we want the ID stored there. 
      // no matter what we are adding this property to the final cache Object because we need the ID no matter what
      tempTypes.push(keyString)
      typeNeedsAdding = true
      keyString = '';
    } else {
      // ??NOT SURE IF THIS MATTERS?????????????????
      totalTypes += 1;
      newQuery += keyString + ' {' + ' id ';
      keyString = '';
      bracketCount += 1;
    }
  }

  function getFromTCOAndNestNewData() {
    if (tempCacheObject[keyString.trim()] && tempCacheObject[keyString.trim()][0]) {
      tempCacheObject = tempCacheObject[keyString.trim()][0];
      tempTypes.push(keyString)
      typeNeedsAdding = true

      keyString = '';

    } else {
      totalTypes += 1;
      newQuery += keyString + ' {' + ' id ';;
      keyString = '';
      bracketCount += 1;
    }
  }

  function filterTCOPropertyByVariable() {
    if (tempCacheObject[variableTypeMatch.trim()]) {
      tempTypes.push(variableTypeMatch)
      typeNeedsAdding = true;
      variableAffectedObject = tempCacheObject[variableTypeMatch.trim()]
      let variableKey = Object.keys(inputObject)
      tempArray = variableAffectedObject.filter(obj => {
        return obj[variableKey[0]] === inputObject[variableKey[0]]
      })
      tempCacheObject = tempArray[0]
      // variableTypeMatch = ''
    } else {
      totalTypes += 1;
      newQuery += keyString + variableTypeMatch + ' {' + ' id ';;
      // variableTypeMatch = ''
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
      if (bracketCount) {
        newQuery += '} '
        // deal with total types, remove, use bracket Count
        totalTypes -= 1;
        // THIS WILL CHANGE !!!!!!!!! GO BACK INTO PREVIOUSLY NESTED OBJECT
        tempCacheObject = {}
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
    variableTypeMatch = keyString;
    variableForFilter = keyString;

    while (query[index] !== ')') {
      holdVarString += query[index];
      index += 1
    }

    holdVarString += query[index]
    index += 1;
  }
  function filterCachePropertyByVariable() {
    if (cacheObject[keyString.trim()]) {
      variableAffectedArray = cacheObject[keyString.trim()]
      let variableKey = Object.keys(inputObject)

      let tempArray = variableAffectedArray.filter(obj => {
        return obj[variableKey[0]] === inputObject[variableKey[0]]
      })

      tempCacheObject = tempArray[0]
      tempTypes.push(variableTypeMatch)
      typeNeedsAdding = true;

      keyString = ''
    } else {
      totalTypes += 1;
      newQuery += keyString + variableTypeMatch + ' {' + ' id ';;
      keyString = ''

    }
  }

  function addStoredTypesToReturnedDataFromCache() {
    tempTypes.forEach(type => {
      tempTypesForCacheData.push(type.trim())
    })
    addTypes()
  }

  function addTypes() {

    if (keyString.trim() === 'id') {
      addFieldToQueryString()
      keyString = 'id'
    }
    let tempCacheData = {};

    let currentType = tempTypesForCacheData.shift()

    tempCacheData[currentType] = cacheObject[currentType]

    let dataFromCacheArr = tempCacheData[currentType]

    if (!tempTypesForCacheData.length) {
      if (variableForFilter && variableForFilter === currentType) {
        let variableKey = Object.keys(inputObject)

        dataFromCacheArr = dataFromCacheArr.filter(obj => {
          return obj[variableKey[0]] === inputObject[variableKey[0]]
        })
      }

      if (!cacheData[currentType]) {
        cacheData[currentType] = Array.from({ length: dataFromCacheArr.length }, i => i = {})
        let cacheDataArr = cacheData[currentType]
        current = addFields(currentType, dataFromCacheArr, cacheDataArr)
      } else {
        let cacheDataArr = current;
        current = addFields(currentType, dataFromCacheArr, cacheDataArr)
      }


    } else {
      const cacheDataArr = current;
      current = addNestedFields(currentType, dataFromCacheArr, cacheDataArr)

      function addNestedFields(currentType, dataFromCacheArr, cacheDataArr) {
        const newCacheDataArr = [];

        for (let i = 0; i < dataFromCacheArr.length; i += 1) {
          if (variableForFilter && variableForFilter === currentType) {
            let variableKey = Object.keys(inputObject)

            dataFromCacheArr = dataFromCacheArr.filter(obj => {
              return obj[variableKey[0]] === inputObject[variableKey[0]]
            })
          }
          let tempData = dataFromCacheArr[i];
          let data = cacheDataArr[i];

          if (tempTypesForCacheData.length) {
            currentType = tempTypesForCacheData.shift()
            if (data[currentType]) {
              const returnedArr = addNestedFields(currentType, tempData[currentType], data[currentType])
              newCacheDataArr.push(returnedArr)
              tempTypesForCacheData.unshift(currentType)
            } else {
              data[currentType] = Array.from({ length: dataFromCacheArr.length }, i => i = {})
              const returnedArr = addNestedFields(currentType, tempData[currentType], data[currentType])
              newCacheDataArr.push(returnedArr)
              tempTypesForCacheData.unshift(currentType)
            }

          } else {
            data[keyString.trim()] = tempData[keyString.trim()]
            newCacheDataArr.push(data)

          }
        }
        return newCacheDataArr
      }
    }
    keyString = ''
  }


  function addFields(currentType, dataFromCacheArr, cacheDataArr) {
    const newCacheDataArr = [];
    for (let i = 0; i < dataFromCacheArr.length; i += 1) {
      let tempData = dataFromCacheArr[i];
      let data = cacheDataArr[i];

      data[keyString.trim()] = tempData[keyString.trim()]
      newCacheDataArr.push(data)
    }
    cacheData[currentType] = newCacheDataArr;
    return newCacheDataArr
  }

  function fieldsInCacheOrNot() {

    if (tempCacheObject[keyString.trim()]) {
      addStoredTypesToReturnedDataFromCache()

    } else if (!tempCacheObject[keyString.trim()]) {
      addFieldToQueryString()
    }
  }

  function addFieldToQueryString() {



    if (typeNeedsAdding && variableTypeMatch === tempTypes[tempTypes.length - 1]) {
      newQuery += tempTypes[tempTypes.length - 1]
      newQuery += holdVarString
      newQuery += ' {' + ' id ';
      bracketCount += 1;
      totalTypes += 1
      holdVarString = ''
      variableTypeMatch = ''
      typeNeedsAdding = false
    } else if (typeNeedsAdding) {
      newQuery += tempTypes[tempTypes.length - 1] + ' {' + ' id ';
      totalTypes += 1
      bracketCount += 1;
      typeNeedsAdding = false

    } else if (keyString.trim() !== 'id') {
      newQuery += keyString;
      isMatched = false
      keyString = '';
    }
    keyString = '';
  }

  function createKeyString() {
    if (query[index].match(charFindRegex)) {
      while (query[index] !== ' ') {
        if (query[index] === '(') {
          parseAndHoldVarLocation()
          break;
        }
        if (query[index] === '}') {
          addFieldToQueryString()
          break;
        }

        keyString += query[index];

        index += 1;
      }
    }


  }

  return [newQuery, cacheData, isMatched];
};

module.exports = serverFilamentQuery