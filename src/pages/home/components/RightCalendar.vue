<template>
  <div class="right-calendar">
    <week-picker @dateValue="setDateValue" @timeValue="setTimeValue"></week-picker>
    <div class="btn-group">
      <ul class="btn-list">
        <li class="btn-item">
          <router-link to="/home/all">今日全部</router-link>
        </li>
        <li class="btn-item">
          <router-link to="/home/personal">个人日程</router-link>
        </li>
      </ul>
    </div>
    <router-view v-bind="$attrs" v-on="$listeners"></router-view>
    <el-popover placement="top" v-model="visible" trigger="click">
      <div class="event-form">
        <h3 class="event-title">添加日程</h3>
        <el-form
          :model="form"
          ref="eventForm"
          :rules="rules"
          hide-required-asterisk
          @submit.native.prevent
        >
          <el-form-item label="事件" label-width=".925925rem" class="event-form-item" prop="action">
            <el-input v-model="form.action" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="详情" label-width=".925925rem" class="event-form-item" prop="detail">
            <el-input v-model="form.detail" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
          </el-form-item>
          <el-form-item label="类别" label-width=".925925rem" class="event-form-item" prop="category" v-if="!form.isCustom">
            <el-select v-model="form.category" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类" label-width=".925925rem" class="event-form-item" prop="customCategory" v-if="form.isCustom">
            <el-input v-model="form.customCategory" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="日期" label-width=".925925rem" class="event-form-item" prop="date">
            <el-date-picker
              v-model="form.date"
              style="width: 100%;"
              :default-value="Date.now()"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="时间" label-width=".925925rem" class="event-form-item" prop="time" v-if="form.isDateExact">
            <el-time-picker
              v-model="form.time"
              style="width: 100%;"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="请选择时间"
              arrow-control
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="收支" label-width=".925925rem" class="event-form-item" prop="income" v-if="form.haveIncome">
            <el-input v-model="form.income" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item size="small" label="精确时间？" label-width="2.925925rem" class="event-form-item" prop="isDateExact">
            <el-switch v-model="form.isDateExact"></el-switch>
          </el-form-item>
          <el-form-item size="small" label="自定义分类？" label-width="2.925925rem" class="event-form-item" prop="isCustom">
            <el-switch size="small" v-model="form.isCustom"></el-switch>
          </el-form-item>
          <el-form-item size="small" label="收支？" label-width="2.925925rem" class="event-form-item" prop="haveIncome">
            <el-switch v-model="form.haveIncome"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submitEvent('eventForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button title="添加日程" type="primary" icon="el-icon-plus" circle class="addBtn" slot="reference"></el-button>
    </el-popover>
  </div>
</template>

<script>
/* eslint-disable */
  import axios from 'axios'
  import moment from 'moment'
  import WeekPicker from './WeekPicker'
  import { mapMutations } from 'vuex'
  export default {
    name: 'RightCalendar',
    // props: {
    //   eventList: Array,
    //   loading: Boolean
    // },
    components: {
      WeekPicker
    },
    data () {
      return {
        curEventList: [],
        newEvent: {},
        visible: false,
        form: {
          action: '',
          date: '',
          time: '',
          detail: '',
          category: '',
          customCategory: '',
          income: 0,
          isDateExact: false,
          isCustom: false,
          haveIncome: false,
        },
        rules: {
          action: [{ required: true, message: '请填写事件~', trigger: 'blur' }],
          detail: [
            { required: true, message: '请填写详细内容~', trigger: 'blur' }
          ],
          date: [{ required: true, message: '请选择日期~', trigger: 'blur' }],
          time: [{ required: true, message: '请选择时间~', trigger: 'blur' }],
          category: [{ required: true, message: '请选择类别~', trigger: 'blur' }],
          customCategory: [{ required: false, message: '请填写分类~', trigger: 'change'}],
          income: [{ required: false, message: '请选择时间~', trigger: 'blur'}],
          isDateExact: [{ required: true }],
          isCustom: [{ required: true }],
          haveIncome: [{ required: true }],
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          },
          shortcuts: [
            {
              text: '今天',
              onClick (picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '明天',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '后天',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                picker.$emit('pick', date)
              }
            },
            {
              text: '三天后',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周后',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        options: [
          {
            value: '科研成果',
            label: '科研成果'
          },
          {
            value: '科研项目',
            label: '科研项目'
          },
          {
            value: '科研平台',
            label: '科研平台'
          },
          {
            value: '学术活动',
            label: '学术活动'
          },
          {
            value: '党务工作',
            label: '党务工作'
          },
          {
            value: '办公室业务',
            label: '办公室业务'
          },
          {
            value: '其他工作',
            label: '其他工作'
          }
        ]
      }
    },
    methods: {
      ...mapMutations(['setQueryDate', 'setQueryTime', 'setQueryUser']),
      setDateValue (date) {
        const formatDate = date || moment(new Date()).format('YYYY-MM-DD')
        this.setQueryDate(formatDate)
      },
      setTimeValue (time) {
        const formatTime = {
          time: time.time || '00:00:00',
          onlyUser: time.onlyUser || false
        }
        this.setQueryTime(formatTime)
      },
      //点击提交
      submitEvent (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios
              .post('/api/events/', this.form)
              .then(this.handleEventCreateSuccess)
              .then(this.handleUpdateUserInfo)
            // axios
            //   .get(`/api/events/${this.$store.state.date}`)
            //   .then(this.handleEventList)
            
          }
        })
      },
      //事件添加成功
      handleEventCreateSuccess (res) {
        res = res.data
        if (res) {
          this.newEvent = res
          this.newEvent.performer = this.$store.state.user
          axios.all([
              axios.get(`/api/events/${this.$store.state.date}`),
              axios.get(`/api/events/${this.$store.state.date}/${localStorage.userid}`)
            ]).then(axios.spread((allRes, userRes) => {
              this.handleList(allRes, userRes)
            }))
          return res
        }
      },
      //更新用户信息
      handleUpdateUserInfo (event) {
        const user = this.$store.state.user
        axios
          .patch(`/api/users/${user.id}`, {
            events: [event]
          })
          .then(res => {
            res = res.data
            if (res) {
              // alert('添加日程成功！')
              this.$message({
                message: '添加日程成功！',
                type: 'success',
              })
              this.visible = false
            }
          })
      },
      //重新请求事件列表
      handleList (allRes, userRes) {
        allRes = allRes.data
        userRes = userRes.data
        this.$emit('update', allRes, userRes)
      },
      //渲染事件列表格式化
      formatterCategory (row, column) {
        switch (row.category) {
          case '1':
            return '科研成果'
            break
          case '2':
            return '科研项目'
            break
          case '3':
            return '科研平台'
            break
          case '4':
            return '学术活动'
            break
          case '5':
            return '党务工作'
            break
          case '6':
            return '办公室业务'
            break
          case '7':
            return '其他工作'
            break
          default:
            break
        }
      },
      //事件发布者格式化
      formatterPerformer (row, column) {
        return row.performer.username
      }
    },
    mounted () {
      const today = moment(new Date()).format('YYYY-MM-DD')
      this.setDateValue(today)
      // this.curEventList = this.eventList
      // console.log('son', this.$attrs)
    }
  }
</script>

<style lang="stylus" scoped>
  .right-calendar >>> .date
    margin-top 0
  .right-calendar
    width 72.5%
    height calc(100vh - 1.907407rem /* 103/54 */)
    .btn-list
      display flex
      justify-content space-between
      align-items center
      .btn-item
        width 50%
        padding 0.277778rem /* 15/54 */
        text-align center
        font-size 0.296296rem /* 16/54 */
    .card-container
      height 9.444444rem /* 510/54 */
      overflow auto
      .event-card
        width 100%
        // display flex
        // justify-content space-around
        // font-size 0.296296rem /* 16/54 */
        .expand-title
          padding 0 0 0.37037rem /* 20/54 */ 0
          font-weight bolder
  .event-form
    display flex
    flex-direction column
    justify-content center
    align-items center
    .event-title
      padding 0.185185rem /* 10/54 */ 0.37037rem /* 20/54 */ 0.37037rem /* 20/54 */ 0.37037rem /* 20/54 */
    .el-form
      display flex
      flex-direction column
      align-items center
    .event-form-item
      width 80%
  .addBtn
    position fixed
    right 50px /* 50/54 */
    bottom 50px /* 30/54 */
</style>
