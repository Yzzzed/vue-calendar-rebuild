<template>
  <div class="todolist">
    <el-container>
      <el-header height="20">
        <h1>
          <el-link type="info" style="color: #fff;" @click="updateNickname">{{user}}</el-link>
          <i class="el-icon-edit el-icon--right"></i>
          <el-divider direction="vertical"></el-divider>
          <span>备忘录</span>
        </h1>
      </el-header>
      <el-main class="main">
        <el-input
          placeholder="回车添加待办事项"
          class="todoinput"
          @keyup.enter.native="add"
          v-model="newtodo.content"
        ></el-input>
        <p class="todoNum">进行中：{{ todolist.length }} 已完成：{{ donenum }}</p>
        <div class="list-row-container">
          <el-row v-for="(item, index) in todolist" class="list-row" :key="index">
            <el-col
              :xs="3"
              :sm="2"
              :md="2"
              :lg="2"
              :xl="2"
              class="check"
              :class="{ 'red': !todolist[index].done, 'green': todolist[index].done }"
            >
              <el-checkbox size="mini" v-model="item.done" class="check-box"></el-checkbox>
            </el-col>
            <el-col :xs="18" :sm="20" :md="20" :lg="20" :xl="20">
              <input
                type="text"
                v-model="item.content"
                class="ipcont"
                :class="{done: todolist[index].done}"
              />
            </el-col>
            <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2" class="close">
              <i class="el-icon-close" @click="del(index)"></i>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" center>
      <el-form :model="editObj" :rules="rules" hide-required-asterisk @submit.native.prevent>
        <el-form-item label="昵称">
          <el-input v-model="editObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
const STORAGE_KEY = 'todolist'

function fetch () {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}
function save (items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export default {
  name: 'TodoList',
  data () {
    return {
      dialogFormVisible: false,
      editObj: {
        nickname: ''
      },
      rules: {
        nickname: [{ required: true, message: '新昵称不能为空~', trigger: 'blur' }]
      },
      user: localStorage.nickname ? localStorage.nickname : '',
      newtodo: {
        content: '',
        done: false
      },
      todolist: fetch()
    }
  },
  methods: {
    updateNickname () {
      this.editObj.nickname = this.user
      this.dialogFormVisible = true
    },
    updateConfirm () {
      this.$confirm('确认要使用新昵称吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this.$store.state.user.id
        axios.patch(`/api/users/${id}`, { nickname: this.editObj.nickname }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.user = this.editObj.nickname
        })
        this.dialogFormVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
        this.dialogFormVisible = false
      })
    },
    add: function () {
      if (this.newtodo.content) {
        this.todolist.push(this.newtodo)
        this.newtodo = { content: '', done: false }
      }
    },
    del: function (index) {
      this.todolist.splice(index, 1)
    }
  },
  computed: {
    donenum: function () {
      return this.todolist.filter(val => val.done).length
    }
  },
  watch: {
    todolist: {
      handler (items) {
        save(items)
      },
      deep: true
    }
  },
  mounted () {
    this.user = localStorage.nickname !== '' ? localStorage.nickname : localStorage.username
  }
}
</script>

<style lang="stylus" scoped>
  .todolist
    background #eee
    margin-top 0.37037rem /* 20/54 */
    border 1px #eee solid
    border-radius 5px
    min-height 50vh
    .el-container
      display flex
      flex-direction column
    .el-main
      height 4.62963rem /* 250/54 */
      background #eee
      border-radius 5px
      display flex
      flex-direction column
      .list-row-container
        flex-grow 1
    .el-header
      color #fff
      background #409EFF
      font-size 0.296296rem /* 16/54 */
      padding 0.185185rem /* 10/54 */
      border 1px #eee solid
      border-radius 5px
      text-align center
    .todoNum
      padding 0.185185rem /* 10/54 */ 0.185185rem /* 10/54 */
    .list-row
      height 0.740741rem /* 40/54 */
      background-color #fbfbfb
      margin-bottom 0.092593rem /* 5/54 */
      display flex
      justify-content center
    .check
      text-align center
      line-height 0.740741rem /* 40/54 */
      .check-box
        margin 0 0.092593rem /* 5/54 */
    .red
      border-left #ef5f65 2px solid
    .green
      border-left #B9E1DC 2px solid
    .ipcont
      padding 0 0.185185rem /* 10/54 */
      margin-top 0.148148rem /* 8/54 */
      border 0
      line-height 0.444444rem /* 24/54 */
      background-color transparent
      font-size 0.296296rem /* 16/54 */
      color #756C83
    .close
      text-align center
      line-height 0.740741rem /* 40/54 */
    .el-icon-close
      cursor pointer
    .el-icon-close:hover
      color #ef5f65
    .done
      text-decoration line-through
</style>
