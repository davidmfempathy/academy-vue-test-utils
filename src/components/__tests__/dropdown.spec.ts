import {mount, Wrapper, WrapperArray} from "@vue/test-utils";
import Dropdown from "@/components/dropdown.vue";
import Vue from 'vue';

describe('Dropdown component tests', () => {
  function createDropdownWrapper({
   options = ['a', 'b', 'c'],
   selected
  }: {
    options?: string[],
    selected?: string
  } = {}): {
    wrapper: Wrapper<Vue>,
    selectedWrapper: Wrapper<Vue>,
    getOptions: () => string[],
    clickItem: (index: number) => void
  } {
    const wrapper = mount(Dropdown, {
      propsData: {
        options,
        selected
      }
    })

    // DONT DO THIS SELECTED WRAPPER UNTIL THE END OF THE TESTS!!!!!!!!
    const selectedWrapper = wrapper.find('.x-dropdown__selected');

    return {
      wrapper,
      selectedWrapper,
      getOptions(): string[] {
        return options;
      },
      async clickItem(index: number): Promise<void> {

        wrapper.findAll('.x-dropdown__item').at(index).trigger('click');
        return Vue.nextTick();
      }
    }
  }

  it('should contain a root div with the class "x-dropdown"', () => {
    const wrapper = mount(Dropdown);
    expect(wrapper.classes('x-dropdown')).toBe(true);
  })

  it('should contain an unordered list with the class "x-dropdown__list"', () => {
    const wrapper = mount(Dropdown);
    expect(wrapper.find('ul.x-dropdown__list').exists()).toBe(true);
  })

  it('should contain items with the class "x-dropdown__item"', () => {
    const optionsStub = ['a', 'b', 'c'];
    const wrapper = mount(Dropdown, {
      propsData: {
        options: optionsStub
      }
    });

    expect(wrapper.find('ul > li.x-dropdown__item').exists()).toBe(true);
  })

  it('should render options provided as prop', () => {
    const optionsStub = ['a', 'b', 'c'];

    const wrapper = mount(Dropdown, {
      propsData: {
        options: optionsStub
      }
    })

    // we're not checking that the prop.options is ['a', 'b', 'c']!
    // data-test="item" with debug
    // const itemsWrapper = wrapper.findAll('[data-test="item"]')
    const itemsWrapper = wrapper.findAll('.x-dropdown__item');

    optionsStub.forEach((option, optionIdx) =>  {
      // its an array!
      expect(itemsWrapper.at(optionIdx).text()).toBe(option);
    })

    expect(wrapper.find('.x-dropdown__item--selected').exists()).toBe(false);
  })

  it('should add selected class to the selected element passed as prop', () => {
    const optionsStub = ['a', 'b', 'c'];
    const optionIdx = 1;

    const wrapper = mount(Dropdown, {
      propsData: {
        options: optionsStub,
        selected: optionsStub[optionIdx]
      }
    })

    expect(wrapper.find('.x-dropdown__item--selected').exists()).toBe(true);
  })

  it('emits "select" event with an option as the value on item click', async ()=> {
    const optionsStub = ['a', 'b', 'c'];

    /*const wrapper = mount(Dropdown, {
      propsData: {
        options: optionsStub
      }
    })*/

    const { wrapper, clickItem } = createDropdownWrapper()

    const optionIdx = 1;
    const itemWrapper = wrapper.findAll('.x-dropdown__item').at(optionIdx);


    //itemWrapper.trigger('click');
    await clickItem(1);
    // do with toBe, notice the array and notice equal
    expect(wrapper.emitted('select')?.[0]).toEqual([optionsStub[optionIdx]]);
  })

  // with the factory function
  it('renders computed selected message', async () => {
    const { wrapper, selectedWrapper } = createDropdownWrapper({ selected: 'b' })

    expect(selectedWrapper.text()).toBe('Selected option: b')

    await wrapper.setProps({ selected: 'a' })

    expect(selectedWrapper.text()).toBe('Selected option: a')
  })
})
