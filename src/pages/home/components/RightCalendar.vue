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
    <!-- <div class="card-container" style="overflow:auto; padding: 0 20px;">
      <el-card v-for="(event, index) of eventList" :key="index" style="margin: .092592rem;">
        <div class="event-card">
          <div class="event-action">{{event.action}}</div>
          <div class="event-category">{{event.category}}</div>
          <div class="event-user">{{event.performer.username}}</div>
          <div class="event-time">{{event.date}}</div>
        </div>
      </el-card>
      <el-table
        :data="curEventList"
        class="event-card"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <p class="expand-title">详细内容:</p>
            <p class="expand-detail">{{props.row.detail}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="事件" min-width="25%"></el-table-column>
        <el-table-column
          prop="category"
          label="分类"
          :formatter="formatterCategory"
          sortable
          min-width="25%"
        ></el-table-column>
        <el-table-column prop="date" label="日期" sortable min-width="25%"></el-table-column>
        <el-table-column
          prop="performer"
          :formatter="formatterPerformer"
          label="发布者"
          min-width="25%"
        ></el-table-column>
      </el-table>
    </div>-->
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
          <el-form-item label="类别" label-width=".925925rem" class="event-form-item" prop="category">
            <el-select v-model="form.category" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" label-width=".925925rem" class="event-form-item" prop="date">
            <el-date-picker
              v-model="form.date"
              style="width: 100%;"
              :default-value="Date.now()"
              value-format="yyyy-MM-dd"
              placeholder="请选择时间"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submitEvent('eventForm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" icon="el-icon-plus" circle class="addBtn" slot="reference"></el-button>
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
          detail: '',
          category: ''
        },
        rules: {
          action: [{ required: true, message: '请填写事件~', trigger: 'blur' }],
          detail: [
            { required: true, message: '请填写详细内容~', trigger: 'blur' }
          ],
          date: [{ required: true, message: '请选择时间~', trigger: 'blur' }],
          category: [{ required: true, message: '请选择类别~', trigger: 'blur' }]
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
            value: '1',
            label: '科研成果'
          },
          {
            value: '2',
            label: '科研项目'
          },
          {
            value: '3',
            label: '科研平台'
          },
          {
            value: '4',
            label: '学术活动'
          },
          {
            value: '5',
            label: '党务工作'
          },
          {
            value: '6',
            label: '办公室业务'
          },
          {
            value: '7',
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
            axios.all([
              axios.get(`/api/events/${this.$store.state.date}`),
              axios.get(`/api/events/${this.$store.state.date}/${localStorage.userid}`)
            ]).then(axios.spread((allRes, userRes) => {
              this.handleList(allRes, userRes)
            }))
          }
        })
      },
      //事件添加成功
      handleEventCreateSuccess (res) {
        res = res.data
        if (res) {
          this.newEvent = res
          this.newEvent.performer = this.$store.state.user
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
              alert('添加日程成功！')
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
      console.log('son', this.$attrs)
    }
  }
</script>

<style lang="stylus" scoped>
  .right-calendar >>> .date
    margin-top 0
  .right-calendar
    width 72.5%
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
    right 0.925926rem /* 50/54 */
    bottom 0.555556rem /* 30/54 */
</style>
