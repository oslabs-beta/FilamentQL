function parseKeyInCache(query) {
  let keyInCache = '';
  let index = 0;
  const charFindRegex = /[a-zA-Z]/;
  let keyString = '';
  let keyWithinCache = 'keyString;';

  skipFirstWord();
  eatWhiteSpace();
  createKeyString();

  keyWithinCache = keyString;
  return keyWithinCache;

  function createKeyString() {
    if (query[index].match(charFindRegex)) {
      while (query[index] !== ' ') {
        if (query[index] === '(') {
          parseAndHoldVarLocation();
          break;
        }

        keyString += query[index];

        index += 1;
      }
    }
  }

  function eatWhiteSpace() {
    // query[index] starts out on a space or linebreak
    while (query[index] === ' ' || query[index] === '\n') {
      index += 1;
    }
    // next query[index] will be a character
  }

  function skipFirstWord() {
    // looks for a 'q', which will mean that we found the word 'query'
    // if we find a '{' it means we found a query using the different syntax
    while (query[index] !== 'q') {
      if (query[index] === '{') {
        index += 1;
        return;
      }
      index += 1;
    }

    // parse the word 'query'
    while (query[index] !== ' ') {
      index += 1;
    }
    index += 1;

    if (query[index] === '{') {
      index += 1;
    }
  }
}

module.exports = parseKeyInCache;
