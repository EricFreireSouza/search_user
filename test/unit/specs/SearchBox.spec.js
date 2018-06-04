import Vue from 'vue'
import SearchBox from '@/components/SearchBox'

describe('SearchBox.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(SearchBox)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.searchbox h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
