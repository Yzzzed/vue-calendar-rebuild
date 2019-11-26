<template>
  <div class="login">
    <login-header></login-header>
    <login-form></login-form>
  </div>
</template>

<script>
import LoginHeader from './components/Header'
import LoginForm from './components/Form'
export default {
  name: 'Login',
  components: {
    LoginHeader,
    LoginForm
  }
}
</script>

<style lang="stylus" scoped>
  .login
    min-height 100vh
    background url('~@/assets/imgs/背景图.jpg') center center no-repeat
    background-size 100% 100%
    background-attachment fixed
    display flex
    flex-direction column
</style>
