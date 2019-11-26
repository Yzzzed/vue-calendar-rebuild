<template>
  <div class="right-calendar">
    <week-picker @dateValue="setDateValue" @timeValue="setTimeValue"></week-picker>
    <div class="card-container" v-infinite-scroll="load" style="overflow:auto">
      <el-card v-for="(event, index) of eventList" :key="index" style="margin: .092592rem;">
        <div class="event-card">
          <div class="event-user">{{event.performer.username}}</div>
          <div class="event-action">{{event.action}}</div>
          <div class="event-time">{{event.date.split('-')[2].split(' ')[1]}}</div>
        </div>
      </el-card>
    </div>
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
          <el-form-item label="时间" label-width=".925925rem" class="event-form-item" prop="date">
            <el-time-picker
              v-model="form.date"
              style="width: 100%;"
              :default-value="Date.now()"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="请选择时间"
            ></el-time-picker>
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
import axios from 'axios'
import moment from 'moment'
import WeekPicker from './WeekPicker'
import { mapMutations } from 'vuex'
export default {
  name: 'RightCalendar',
  props: {
    eventList: Array,
    loading: Boolean
  },
  components: {
    WeekPicker
  },
  data () {
    return {
      curEventList: [],
      newEvent: {},
      count: 0,
      visible: false,
      form: {
        action: '',
        date: ''
      },
      rules: {
        action: [{ required: true, message: '请填写事件~', trigger: 'blur' }],
        date: [{ required: true, message: '请选择时间~', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['setQueryDate', 'setQueryTime', 'setQueryUser']),
    load () {
      this.count += 1
    },
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
    submitEvent (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post('/api/events/', this.form)
            .then(this.handleEventCreateSuccess)
            .then(this.handleUpdateUserInfo)
        }
      })
    },
    handleEventCreateSuccess (res) {
      res = res.data
      if (res) {
        this.newEvent = res
        this.newEvent.performer = this.$store.state.user
        return res
      }
    },
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
            this.eventList.push(this.newEvent)
          }
        })
    }
  },
  mounted () {
    const today = moment(new Date()).format('YYYY-MM-DD')
    this.setDateValue(today)
    this.curEventList = this.eventList
  }
}
</script>

<style lang="stylus" scoped>
  .right-calendar >>> .date
    margin-top 0
  .right-calendar
    width 72.5%
    .card-container
      height 9.444444rem /* 510/54 */
      overflow auto
      .event-card
        display flex
        justify-content space-around
        font-size 0.296296rem /* 16/54 */
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
