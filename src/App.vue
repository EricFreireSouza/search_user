<template>
  <div id="app">
    <SearchBox />
  </div>
</template>

<script>
import SearchBox from './components/SearchBox.vue'

export default {
  name: 'app',
  components: {
    SearchBox
  }
}
</script>

<style scoped>
  body{
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app{
    text-align: center;
    color: #2c3e50;
  }
</style>