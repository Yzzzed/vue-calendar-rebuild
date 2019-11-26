<template>
  <div class="header">
    <el-image :src="logoURL" fit="scale-down" class="header-img"></el-image>
    <span class="header-title">东北师范大学</span>
  </div>
</template>

<script>
import logoImg from '@/assets/imgs/校徽.png'
export default {
  name: 'RegisterHeader',
  data () {
    return {
      logoURL: logoImg
    }
  }
}
</script>

<style lang="stylus" scoped>
  .header
    height 1.481481rem
    padding 0.555556rem 0.37037rem
    display flex
    justify-content center
    align-items center
    .header-img
      width 1.481481rem
      height 1.777778rem
    .header-title
      font-size 0.740741rem /* 40/54 */
</style>
