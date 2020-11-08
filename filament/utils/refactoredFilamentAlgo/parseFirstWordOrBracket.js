// parseClientFilamentQuery.js
const parseClientFilamentQuery = (query) => {
  let index = 0;
  let newQuery = '';

  let [bracketCount, foundBracketOrQ] = findFirstLetterOrBracket()

  if (foundBracketOrQ === 'q') {
    parseTheWordQuery()
    parseIfNameOrVariable()
    bracketCount = parseClosingBracket(bracketCount)
  }
}

// helperFunctions.js
const addElementAndIncrementIndex = () => {
  newQuery += query[index];
  index += 1;
}

// parseNamesAndVariables.js
const parseIfNameOrVariable = () => {
  const charFindRegex = /[a-zA-Z]/;

  if (query[index].match(charFindRegex)) {
    parseName();

    if (query[index] === ' ') {
      index += 1;
    } else {
      parseVariable();
    }
  }
}

function parseName() {
  while (query[index] !== '(' || /\s/.test(query[index])) {
    newQuery += query[index];
    index += 1;
  }
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

const parseTheWordQuery = () => {
  while (query[index] !== ' ') {
    addElementAndIncrementIndex()
  }
  addElementAndIncrementIndex()
}

const findFirstLetterOrBracket = () => {
  let bracketCount = 0;
  let foundBracketOrQ = 'q';

  while (query[index] !== 'q') {
    if (query[index] === '{') {
      bracketCount = parseClosingBracket(bracketCount)
      foundBracketOrQ = 'bracket';
      break;
    }

    index += 1;
  }

  return [bracketCount, foundBracketOrQ];
}

const parseClosingBracket = (bracketCount) => {
  if (query[index] === '{') {
    newQuery += query[index] + ' ';
    index += 1;
    bracketCount += 1;
  }

  return bracketCount;
}