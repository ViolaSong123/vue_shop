<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      actived: !0
    }
  },
  components: {

  }
}
</script>

<style lang='less' scoped>
#app，body{
  width:100%;
  height:100%;
  margin:0;
  padding:0;
}
.active{
  color:red;
}
</style>
