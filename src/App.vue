<template>
  <div id='app'>
    Dropdown
    <div class="x-options">{{ options.join() }}</div>
    <div class="x-status">{{ status }}</div>
    <Dropdown
      :options="options"
      v-model="selected"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Dropdown from '@/components/dropdown.vue'
import axios, { AxiosResponse } from 'axios'

@Component({
  components: { Dropdown }
})
export default class App extends Vue {
  options: string[] = []
  selected: string | null = null;
  status = 'off';

  mounted (): void {
    /*
      this.$http.get('http://localhost:3001/options')
      .then(({ data: options }: AxiosResponse) => {
        this.options = options
      })
    */
    axios.get('http://localhost:3001/options')
      .then(({ data: options }: AxiosResponse) => {
        this.options = options
      })


    setTimeout(() => {
      this.status = 'on'
    }, 500)
  }
}
</script>

<style>
</style>
