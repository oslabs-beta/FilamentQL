const transformQuery = (query) => {
  const parts = query.split(' ');
  const stack = [];
  let indentations = 2;
  let result = '';

  parts.forEach((part, idx) => {
    if (part === '{') {
      stack.push(part);
      indentations += 2;
    } else if (part === '}') {
      stack.pop();
      indentations -= 2;
      const space = ' '.repeat(indentations);
      result += space + part + '\n';
    } else {
      const space = ' '.repeat(indentations);

      if (part === 'query') result += space + part + ' {' + '\n';
      else {
        const open = parts[idx + 1] === '{' ? ' {' : '';
        result += space + part + open + '\n';
      }
    }
  });

  return result;
};

module.exports = transformQuery;
