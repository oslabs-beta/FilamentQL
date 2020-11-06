const getSessionStorageKey = (query) => {
  const res = query
    .split('\n')
    .filter((part) => part)
    .map((part) => part.trim());
  const key = res[1].replace(' {', '');

  return key;
};

module.exports = getSessionStorageKey;
