import { mount } from '@vue/test-utils'
import App from '../app.vue'
import axios from "axios";

jest.useFakeTimers();

describe('App tests', () => {

/*  test('mocking $http', async () => {
    const optionsStub = ['x', 'y', 'z']

    const mockHttp = {
      get: () => {
        return new Promise((resolve, reject) => {
          resolve({ data: optionsStub })
        })
      }
    }

    const wrapper = mount(App, {
      mocks: {
        $http: mockHttp
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.x-options').text()).toBe(optionsStub.join());
  })*/

  test('mocking with jest fn', async () => {
    const optionsStub = ['x', 'y', 'z']

    jest.mock('axios');
    axios.get = jest.fn().mockImplementationOnce(() => Promise.resolve({ data: optionsStub }))

    const wrapper = mount(App)

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.x-options').text()).toBe(optionsStub.toString());
  })

  test('mock spy', async () => {
    const optionsStub = ['x', 'y', 'z']

    jest.mock('axios');
    axios.get = jest.fn().mockImplementationOnce(() => Promise.resolve({ data: optionsStub }))

    const wrapper = mount(App)

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.x-options').text()).toBe(optionsStub.toString());
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/options');

<<<<<<< HEAD
  test('fakeTimers', async () => {
    const wrapper = mount(App);

    jest.advanceTimersByTime(500);
    //jest.advanceTimersByTime(500);
=======
    jest.advanceTimersByTime(500);
>>>>>>> b267e0b84dc5df1161bf88b8ef7c9e3b5d20c53f

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.x-status').text()).toBe('on');
  })

})
