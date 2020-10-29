import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TodoItem from '../components/TodoItem.jsx';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

describe('initial test', () => {
  let wrapper;

  const props = {
    id: 1342432,
    text: 'test',
    isCompleted: false,
    number: 5,
    toggleTodo: true
  }

  beforeAll(() => {
    wrapper = shallow(<TodoItem {...props} />);
  })

  it('should return false', () => {
    expect(wrapper.find('button').length).toEqual(3)
  })
})

