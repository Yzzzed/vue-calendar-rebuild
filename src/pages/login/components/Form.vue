<template>
  <div class="login-form">
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="form-container"
      label-position="left"
      label-width="auto"
      hide-required-asterisk
      @submit.native.prevent
    >
      <h3 class="form-title">登录</h3>
      <el-form-item label="用户名" prop="username" class="form-item">
        <el-input type="text" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="form-item">
        <el-input
          type="text"
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          :error="errMsg"
        ></el-input>
      </el-form-item>
      <div class="form-btns">
        <el-button
          type="warning"
          @click="loginSubmit('loginForm')"
          class="form-btn"
          native-type="submit"
        >登录</el-button>
        <el-button type="primary" @click="loginReset('loginForm')" class="form-btn">重置</el-button>
      </div>
      <div class="link">
        <router-link to="/register" tag="el-link">注册>>></router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginForm',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      errMsg: null,
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['setToken', 'userLogin']),
    loginSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交表单数据
          axios
            .post('/api/users/login', this.form)
            .then(this.handleLogin, e => {
              this.$refs.loginForm.fields[1].error = '用户名或密码不正确~'
            })
        }
      })
    },
    loginReset (formName) {
      this.$refs[formName].resetFields()
    },
    handleLogin (res) {
      res = res.data
      if (res.token) {
        this.setToken(res.token)
        this.userLogin(res.user)
        if (this.$store.state.token) {
          this.$router.push('/home')
        } else {
          this.$router.replace('/')
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .login-form
    margin 0.740741rem /* 40/54 */ 0
    display flex
    justify-content center
    .form-container
      width 55%
      background #D1DCE2
      border-radius 5px
      .form-title
        padding 0.37037rem /* 20/54 */
        text-align center
        font-size 0.37037rem
      .form-item
        padding 0 0.37037rem /* 20/54 */
      .form-btns
        padding 0.37037rem
        display flex
        justify-content center
        align-items center
        .form-btn
          margin 0 0.740741rem /* 40/54 */
          width 1.481481rem
          padding 0.185185rem
      .link
        margin 0.185185rem /* 10/54 */
        display flex
        flex-direction row-reverse
</style>
