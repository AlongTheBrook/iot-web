<template>
    <div :class="[$style.red]">hello 你好
      <div :class="[$style.abc]">我是子元素</div>
      <a class="button">Button</a>
    </div>
</template>

<script>
export default {
  name: 'device-cfg'
}
</script>

<style lang="scss" module>
.red {
  color: red;
  & > .abc {
    color: blue;
  }
}
</style>
