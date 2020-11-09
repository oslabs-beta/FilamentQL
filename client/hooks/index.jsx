import { useState } from 'react';

export const useInput = (defaultInput = '') => {
  const [input, setInput] = useState(defaultInput);
  const handleChange = ({ target: { value } }) => setInput(value);
  return [input, setInput, handleChange];
};
