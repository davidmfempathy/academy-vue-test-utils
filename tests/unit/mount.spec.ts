import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { CreateElement, RenderContext } from "vue";
import { DefaultProps } from "vue/types/options";

describe('mount examples', () => {
  test('hello world', () => {
    const wrapper = mount({
      template: `<div>hello world</div>`,
    })

    expect(wrapper.text()).toBe('hello world')
  })

  test('attachTo', () => {
    const TestComponent = {
      template: "<div>hello</div>"
    }

    const wrapper = mount(TestComponent, {
      attachTo: document.body
    })

    expect(wrapper.vm.$el.parentNode).toBe(document.body)
  })

  test('context', () => {
    const FunctionalComponent = {
      functional: true,
      props: {
        name: {
          type: String,
          required: true
        }
      },
      render: (createElement: CreateElement, context: RenderContext<DefaultProps>) => {
        return createElement('div', `My name is ${context.props.name}`)
      }
    }

    const wrapper = mount(FunctionalComponent, {
      context: {
        props: {
          name: 'David'
        }
      }
    })

    expect(wrapper.text()).toBe("My name is David");
  })

  test('localVue', () => {
    const TestComponent = {
      template: "<div>hello</div>"
    }

    const localVue = createLocalVue()

    // localVue.use(plugin)

    const wrapper = mount(TestComponent, {
      localVue
    })

    // const wrapper = mount(TestComponent) // It won't work!

    expect(wrapper.vm).toBeInstanceOf(localVue)
  })

  describe('mocks', () => {
    const TestComponent = {
      template: '<div>Total: {{ getTotal(amount, price) }} €</div>',
      data: function () {
        return {
          amount: 3,
          price: 10
        }
      }
    }

    test('returns Total: 30 €', () => {
      const wrapper = mount(TestComponent, {
        mocks: {
          getTotal (amount: number, price: number): number {
            return amount * price
          }
        }
      })
      expect(wrapper.text()).toBe('Total: 30 €')
    })

    test('returns Total: 30 € + with tax', () => {
      const wrapper = mount(TestComponent, {
        mocks: {
          getTotal (amount: number, price: number): number {
            return amount * price * 1.21
          }
        }
      })
      expect(wrapper.text()).toBe('Total: 36.3 €')
    })
  })

  describe('slots', () => {
    const ChildComponent = {
      template: '<div>child</div>'
    }

    const TestComponent = {
      template:
        '<section>' +
        '<slot name="title" v-bind:title="defaultTitle" />' +
        '<slot />' +
        '<slot name="footer" />' +
        '</section>'
      ,
      data: function () {
        return {
          defaultTitle: "EmpathyX"
        }
      }
    }

    test("default slot and named slots", () => {
      const wrapper = mount(TestComponent, {
        slots: {
          default: [ChildComponent, '<div>new child</div>'],
          title: '<div>title</div>',
          footer: '<div>footer</div>'
        }
      })

      // not using .html() because of the prettyPrint, just for this example
      expect(wrapper.element.outerHTML).toEqual(
        '<section><div>title</div><div>child</div><div>new child</div><div>footer</div></section>'
      )
    })

    test("scoped slots", () => {
      const wrapper = mount(TestComponent, {
        scopedSlots: {
          title: '<div slot-scope="{ title }">{{ title }}</div>',
        }
      })

      expect(wrapper.text()).toBe("EmpathyX");
    })
  })

  describe('stubs', () => {
    const ChildComponent = {
      template: '<span>child</span>'
    }

    test('child component', () => {
      const ParentComponent = {
        components: { ChildComponent },
        template: '<div>parent: <ChildComponent /></div>'
      }

      const wrapper = mount(ParentComponent)

      expect(wrapper.text()).toBe('parent: child')
    })

    test('stub child I', () => {
      const ParentComponent = {
        template: '<div>parent: <ChildComponent /></div>'
      }

      const wrapper = mount(ParentComponent, {
        stubs: {
          ChildComponent
        }
      })

      expect(wrapper.text()).toBe('parent: child')
    })

    test('stub child II', () => {
      const ParentComponent = {
        template: '<div>parent: <CustomChild /></div>'
      }

      const wrapper = mount(ParentComponent, {
        stubs: {
          CustomChild: ChildComponent // any implementation
        }
      })

      expect(wrapper.text()).toBe('parent: child')
    })

    test('default stub child', () => {
      const ParentComponent = {
        template: '<div>parent: <ChildComponent ref="child" /></div>'
      }

      const wrapper = mount(ParentComponent, {
        stubs: {
          ChildComponent: true
        }
      })

      expect(wrapper.findComponent({ ref: 'child'}).exists()).toBe(true)
      expect(wrapper.text()).toBe('parent:');
      expect(wrapper.vm.$el.outerHTML).toBe('<div>parent: <childcomponent-stub></childcomponent-stub></div>')
    })

    test('shallowMount', () => {
      const ParentComponent = {
        components: { ChildComponent },
        template: '<div>parent: <ChildComponent ref="child" /></div>'
      }

      const wrapper = shallowMount(ParentComponent)

      expect(wrapper.findComponent({ ref: 'child'}).exists()).toBe(true)
      expect(wrapper.text()).toBe('parent:');
    })
  })

  describe('propsData', () => {
    const TestComponent = {
      props: {
        today: {
          default: 'Monday'
        }
      },
      template: '<div>Today is {{ today }}!</div>'
    }

    it('should render Monday', () => {
      const wrapper = mount(TestComponent)
      expect(wrapper.text()).toBe('Today is Monday!');
    })

    it('should render Tuesday', () => {
      const wrapper = mount(TestComponent, {
        propsData: {
          today: "Tuesday"
        }
      })

      expect(wrapper.text()).toBe('Today is Tuesday!');
    })
  })

  describe('data', () => {
    const TestComponent = {
      data () {
        return {
          today: 'Monday'
        }
      },
      template: '<div>Today is {{ today }}!</div>'
    }

    it('should render Monday', () => {
      const wrapper = mount(TestComponent)
      expect(wrapper.text()).toBe('Today is Monday!');
    })

    it('should render Tuesday', () => {
      const wrapper = mount(TestComponent, {
        data () {
          return {
            today: "Tuesday"
          }
        }
      })

      expect(wrapper.text()).toBe('Today is Tuesday!');
    })
  })
})
