<template>
  <div class="register-form">
    <el-form
      ref="registerForm"
      :model="form"
      :rules="rules"
      class="form-container"
      label-position="left"
      label-width="auto"
      hide-required-asterisk
      @submit.native.prevent
    >
      <h3 class="form-title">注册</h3>
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
      <el-form-item label="确认密码" prop="passwordConfirm" class="form-item">
        <el-input
          type="text"
          v-model="form.passwordConfirm"
          placeholder="请再次输入密码"
          show-password
          :error="errMsg"
        ></el-input>
      </el-form-item>
      <div class="form-btns">
        <el-button type="warning" @click="registerSubmit('registerForm')" class="form-btn">注册</el-button>
        <el-button type="primary" @click="registerReset('registerForm')" class="form-btn">重置</el-button>
      </div>
      <div class="link">
        <router-link to="/" tag="el-link">登录>>></router-link>
      </div>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <span>{{regMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="gotoLogin()" size="mini">登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RegisterForm',
  data () {
    return {
      form: {
        username: '',
        password: '',
        passwordConfirm: ''
      },
      regMsg: '',
      dialogVisible: false,
      errMsg: null,
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 4, max: 16, message: '长度应为4-16个字符~', trigger: 'blur' },
          {
            pattern: /^[A-Za-z_][A-Za-z_0-9]{3,15}$/,
            message: '不能以数字开头嗷~',
            trigger: 'blur'
          },
          { validator: this.checkUserExist, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度应为6-20个字符~', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入确认密码哦~', tigger: 'blur' },
          { validator: this.checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交表单数据
          axios
            .post('/api/users', {
              username: this.form.username,
              password: this.form.password
            })
            .then(res => {
              res = res.data
              this.regMsg = res.message
              this.dialogVisible = true
            })
        }
      })
    },
    registerReset (formName) {
      this.$refs[formName].resetFields()
    },
    checkPass (rule, val, callback) {
      if (val !== this.form.password) {
        callback(new Error('两次密码输入不一致~'))
      } else {
        callback()
      }
    },
    checkUserExist (rule, val, callback) {
      axios
        .post('/api/users/checkExist', { username: this.form.username })
        .then(res => {
          res = res.data
          if (res.code === 1) {
            callback(new Error(res.message))
          }
          callback()
        })
    },
    gotoLogin () {
      this.dialogVisible = false
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .register-form
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
