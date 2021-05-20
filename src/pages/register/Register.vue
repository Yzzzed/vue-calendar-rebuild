<template>
  <div class="login">
    <register-header></register-header>
    <register-form></register-form>
  </div>
</template>

<script>
import RegisterHeader from './components/Header'
import RegisterForm from './components/Form'
export default {
  name: 'Register',
  components: {
    RegisterHeader,
    RegisterForm
  }
}
</script>

<style lang="stylus" scoped>
  .login
    min-height 100vh
    background #409EFF
    background-size 100% 100%
    background-attachment fixed
    display flex
    flex-direction column
</style>
