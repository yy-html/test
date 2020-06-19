<template>
  <div
    class="item-file-box"
  >
    <img :src="iconUrl" :style="{width: `${imgWidth}px`}" />
    <p>{{iconName}}</p>
  </div>
</template>

<script>
export default {
  props: ['iconName', 'iconUrl', 'imgWidth']
}
</script>

<style scoped lang="scss">
.item-file-box {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  margin: 10px;
}
</style>