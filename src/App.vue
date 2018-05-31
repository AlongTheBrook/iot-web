<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// noinspection JSUnresolvedFunction
require('./external/iconfont')

export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '~bulma';

html {
  background-color: #ecf0f5;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);  // 去除移动端点击操作出现的灰色快
}

#app {
  width: 100%;
  max-width: 1136px;
  /*border: solid 1px rgba(197, 197, 197, 0.44);*/
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: BlinkMacSystemFont, -apple-system, "Microsoft Yahei", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
