<template>
  <div id="app" :class="userAgent.isDesktopOrTv ? 'is-desktop-or-tv' : null">
    <device-cfg :user-agent="userAgent" />
  </div>
</template>

<script>
import userAgent from './external/userAgent'
import DeviceCfg from './components/DeviceCfg'
// noinspection JSUnresolvedFunction
require('./external/iconfont')

export default {
  components: {DeviceCfg},
  name: 'App',
  data () {
    return {
      userAgent: userAgent
    }
  }
}
</script>

<style lang="scss">
@import '~bulma';
@import './style/tooltip.scss';

html {
  background-color: #ecf0f5;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);  // 去除移动端点击操作出现的灰色快
}

#app {
  width: 100%;
  /*max-width: 1136px;*/
  /*border: solid 1px rgba(197, 197, 197, 0.44);*/
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: BlinkMacSystemFont, -apple-system, "Microsoft Yahei", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

/// 为与主框架融洽相处而不得不做的Hack工作
/// Hack start...
header.main-header {
  font-size: 14px;
  line-height: 1.42857143;
  font-family: 'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;
  //noinspection SpellCheckingInspection
  & > nav.navbar.navbar-static-top {
    display: block;
  }
}
aside.main-sidebar {
  font-size: 14px;
  line-height: 1.42857143;
  font-family: 'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;
}
.tooltip-inner {
  max-width: 256px !important;
  text-align: left !important;
}
/// Hack end.

.is-desktop-or-tv {
  padding: 0.5rem;
}

.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
