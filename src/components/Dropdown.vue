<template>
  <div class='x-dropdown'>
    <div class='x-dropdown__selected'>{{ selectedMessage }}</div>
    <ul class='x-dropdown__list'>
      <li
        :key='option'
        class='x-dropdown__item'
        :class='computedOption.class'
        v-for='(computedOption, option) of computedOptions'
        @click="emitSelected(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  model: {
    event: 'select',
    prop: 'selected'
  }
})
export default class Dropdown extends Vue {
  @Prop({ default: function () { return [] } })
  public options!: string[];

  @Prop({ default: null })
  public selected!: string | null;

  protected get computedOptions (): Record<string, boolean> {
    return this.options.reduce((prev, current) => {
      return {
        ...prev,
        [current]: {
          class: {
            'x-dropdown__item--selected': current === this.selected
          }
        }
      }
    }, {})
  }

  protected get selectedMessage (): string {
    return `Selected option: ${this.selected}`
  }

  emitSelected (option: string): void {
    this.$emit('select', option)
  }
}
</script>

<style lang="scss">
  .x-dropdown {
    &__item {
      &--selected {
        background-color: red;
      }
    }
  }
</style>
