<template>
<div :class="$style.module">
  <div :class="$style.title">创建或修改设备</div>
  <div :class="$style.content">
    <div :class="[$style.block, collapsedBasicMsg ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedBasicMsg = !collapsedBasicMsg"><div>基本信息</div></div>
      <div :class="$style.body">
        <div><div>名称</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>描述</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>接入码</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" value="<创建后自动生成>" disabled></div></div>
      </div>
    </div>
    <div :class="[$style.block, collapsedConnectWay ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedConnectWay = !collapsedConnectWay"><div>接入方式</div></div>
      <div :class="$style.body">
        <div><div>接入方式</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>注册包</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>心跳包</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>心跳周期</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
      </div>
    </div>
    <div :class="[$style.block, collapsedDeviceType ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedDeviceType = !collapsedDeviceType"><div>设备类型</div></div>
      <div :class="$style.body">
        <div><div>设备类型</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>从站地址</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
        <div><div>数采间隔</div><div><input class="input is-small is-radiusless" :class="$style.input" type="text" placeholder="Text input"></div></div>
      </div>
    </div>
    <div :class="[$style.block, collapsedDataCfg ? $style.collapsed : null]">
      <div :class="$style.head" @click="collapsedDataCfg = !collapsedDataCfg"><div>数据配置</div></div>
      <div :class="$style.body">内容</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'device-cfg',
  data () {
    return {
      collapsedBasicMsg: false,
      collapsedConnectWay: false,
      collapsedDeviceType: false,
      collapsedDataCfg: false
    }
  }
}
</script>

<style lang="scss" module>
.input {
  height: 1.5rem;
  padding: 0 0.25rem 0.1rem 0.25rem;
  font-size: 1rem!important;
  border-top: none;
  border-right: none;
  border-left: none;
  box-shadow: none;
  &:focus, &:active {
    box-shadow: 0 0.125rem 0 0 rgba(50, 115, 220, 0.25);
  }
}

.module {
  width: 100%;
  & > * {
    background-color: white;
    margin-bottom: 0.5rem;
  }
  & > .title {
    width: 100%;
    padding: 0.5rem;
  }
  & > .content {
    & > .block {
      position: relative;
      padding: 0.5rem;
      $border-color: rgba(197, 197, 197, 0.44);
      &:first-child::before {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        border-bottom: 1px solid $border-color;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: calc(100% - 0.5rem);
        border-bottom: 1px solid $border-color;
      }
      &:last-child::after {
        width: 100%;
      }
      $ec-btn-size: 0.5rem;
      & > .head {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: bold;
        & > :first-child {
          flex: auto;
        }
        &::after {
          flex: none;
          content: '';
          width: $ec-btn-size;
          height: $ec-btn-size;
          $border-color: gray;
          border-top: 1px solid $border-color;
          border-right: 1px solid $border-color;
          transform: translate3d(-$ec-btn-size / 2, $ec-btn-size / 4, 0) rotate(-45deg);
        }
      }
      & > .body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        & > * {
          flex: auto;
          display: flex;
          align-items: center;
          padding: 0.5rem;
          & > :first-child {
            flex: none;
            font-weight: bold;
            color: #606060;
          }
          & > * {
            flex: auto;
            padding-right: 0.5rem;
          }
        }
      }
      &.collapsed {
        & > .head::after {
          transform: translate3d(-$ec-btn-size / 2, -$ec-btn-size / 4, 0) rotate(135deg);
        }
        & > .body {
          display: none;
        }
      }
    }
  }
}
</style>
