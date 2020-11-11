import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TodoItem from '../components/Main/TodoItem';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

xdescribe('initial test', () => {
  let wrapper;

  const props = {
    id: 1342432,
    text: 'test',
    isCompleted: false,
    number: 5,
    toggleTodo: true,
  };

  beforeAll(() => {
    wrapper = shallow(<TodoItem {...props} />);
  });

  it('should fail the test', () => {
    expect(wrapper.find('button').length).toEqual(3);
  });

  it('should pass the test', () => {
    expect(wrapper.find('button').length).toEqual(2);
  });
});
