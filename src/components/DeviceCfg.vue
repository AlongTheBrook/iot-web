<template>
<div :class="$style.module">
  <div :class="$style.title">创建或修改设备</div>
  <div :class="$style.content">
    <div :class="$style.baseMsg">
      <div :class="[$style.head, this.collapsed ? $style.collapsed : null]">
        <div>基本信息</div>
      </div>
    </div>
    <div :class="$style.connectWay">
      <div :class="[$style.head, this.collapsed ? $style.collapsed : null]">
        <div :class="$style.content">接入方式</div>
      </div>
    </div>
    <div :class="$style.deviceType">
      <div :class="[$style.head, this.collapsed ? $style.collapsed : null]">
        <div :class="$style.content">设备类型</div>
      </div>
    </div>
    <div :class="$style.dataCfg">
      <div :class="[$style.head, this.collapsed ? $style.collapsed : null]">
        <div :class="$style.content">数据配置</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'device-cfg',
  data () {
    return {
      collapsed: false
    }
  }
}
</script>

<style lang="scss" module>
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
    & > * {
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
      & > .head {
        display: flex;
        align-items: center;
        &:first-child {
          flex: auto;
        }
        $ec-btn-size: 0.5rem;
        &::after {
          flex: none;
          content: '';
          width: $ec-btn-size;
          height: $ec-btn-size;
          $border-color: gray;
          border-top: 1px solid $border-color;
          border-right: 1px solid $border-color;
          transform: translateX(-$ec-btn-size / 2) rotate(-45deg);
        }
        &.collapsed::after {
          transform: translateX(-$ec-btn-size / 2) rotate(135deg);
        }
      }
    }
    & > .base-msg {
    }
    & > .connect-way {
    }
    & > .device-type {
    }
    & > .data-cfg {
    }
  }
}
</style>
