<template>
  <div class="date">
    <el-row>
      <el-col :span="24">
        <div class="weeks">
          <!-- 日期 -->
          <ul class="days">
            <li @click="weekPre" class="prev-btn">
              <i class="fa fa-angle-left fa-icon" aria-hidden="true"></i>
              <span class="hidden-sm-and-down">上一周</span>
            </li>
            <li
              class="date-item"
              @click="pick(day, index)"
              v-for="(day, index) in days"
              :key="index"
              :class="{ selected: index == tabIndex }"
            >
              <!--本月-->
              <span v-if="day.getMonth() + 1 != currentMonth" class="other-month item-wrapper">
                <p>{{ day | getWeekFormat }}</p>
                <span class="hidden-sm-and-down">{{ day | dateFormat }}</span>
              </span>
              <span v-else>
                <!--今天-->
                <span
                  v-if="
                    day.getFullYear() == new Date().getFullYear() &&
                      day.getMonth() == new Date().getMonth() &&
                      day.getDate() == new Date().getDate()
                  "
                  class="today-item"
                >今天</span>
                <span class="item-wrapper" v-else>
                  <p>{{ day | getWeekFormat }}</p>
                  <span class="hidden-sm-and-down">{{ day | dateFormat }}</span>
                </span>
              </span>
            </li>
            <li @click="weekNext" class="next-btn">
              <span class="hidden-sm-and-down">下一周</span>
              <i class="fa fa-angle-right fa-icon" aria-hidden="true"></i>
            </li>
            <!-- <li>
              <span>
                <el-date-picker
                  class="right-pick-btn"
                  style="width: 100%"
                  :clearable="false"
                  @change="pickDate"
                  v-model="newDate"
                  type="date"
                  placeholder="按日期查询"
                ></el-date-picker>
              </span>
            </li>-->
          </ul>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="20" :offset="2" class="time-range">
        <span
          @click="pickTime(time, index)"
          v-for="(time, index) in times"
          :key="index"
          :class="{ active: index == tabTimeIndex }"
        >{{ time.label }}</span>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
  /* eslint-disable */
  import _ from 'lodash'
  import moment from 'moment'
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: 'WeekPicker',
    props: {
      dateValue: {
        type: String,
        default: moment(new Date()).format('YYYY-MM-DD')
      },
      timeValue: {
        type: String,
        default: '00:00'
      },
      userInfo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        currentYear: 1970, // 年份
        currentMonth: 1, // 月份
        currentDay: 1, // 日期
        currentWeek: 1, // 星期
        days: [],
        value1: '',
        tabIndex: null,
        newDate: moment(new Date()).format('YYYY-MM-DD'),
        tabTimeIndex: 0,
        times: [
          { time: '00:00~24:00', label: '今日全部', user: false },
          { time: '00:00~06:00', label: '00:00~06:00', user: false },
          { time: '06:00~12:00', label: '06:00~12:00', user: false },
          { time: '12:00~18:00', label: '12:00~18:00', user: false },
          { time: '18:00~24:00', label: '18:00~24:00', user: false },
          { time: '00:00~24:00', label: '个人日程', user: true }
        ]
      }
    },
    filters: {
      dateFormat(date) {
        return moment(date).format('YYYY-MM-DD')
      },
      getWeekFormat(date) {
        const weeksObj = {
          1: '周一',
          2: '周二',
          3: '周三',
          4: '周四',
          5: '周五',
          6: '周六',
          7: '周日'
        }
        let weekNumber = moment(date).isoWeekday()
        return weeksObj[weekNumber]
      }
    },
    computed: {
      ...mapState({
        conDate: 'selectedDate'
      })
    },
    watch: {
      conDate(val, oldVal) {
        console.log(val, oldVal)
        this.pickDate(val)
      },
      newDate() {
        this.setQueryDate(this.newDate)
      }
    },
    mounted() {
      const index = _.findIndex(this.days, function(o) {
        // console.log('o: ', o.getDate());
        // console.log('new Date().getDate(): ', new Date().getDate());
        return o.getDate() === new Date().getDate()
      })
      this.tabIndex = index
    },
    created() {
      this.initData(null)
    },
    methods: {
      ...mapMutations(['setQueryDate']),
      formatDate(year, month, day) {
        const y = year
        let m = month
        if (m < 10) m = `0${m}`
        let d = day
        if (d < 10) d = `0${d}`
        return `${y}-${m}-${d}`
      },
      pickDate(date) {
        let that = this
        that.newDate = moment(date).format('YYYY-MM-DD')
        that.$emit('dateValue', that.newDate)
        that.initData(that.newDate)
        const index = _.findIndex(that.days, function(o) {
          return o.getDate() === new Date(that.newDate).getDate()
        })
        this.tabIndex = index
      },
      initData(cur) {
        let date = ''
        if (cur) {
          date = new Date(cur)
        } else {
          date = new Date()
        }
        console.log(date)
        this.currentDay = date.getDate() // 今日日期 几号
        this.currentYear = date.getFullYear() // 当前年份
        this.currentMonth = date.getMonth() + 1 // 当前月份
        this.currentWeek = date.getDay() // 1...6,0  // 星期几
        if (this.currentWeek === 0) {
          this.currentWeek = 7
        }
        const str = this.formatDate(
          this.currentYear,
          this.currentMonth,
          this.currentDay
        ) // 今日日期 年-月-日
        this.days.length = 0
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        /* eslint-disabled */
        // 今天
        for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
          const d = new Date(str)
          d.setDate(d.getDate() - i)
          // console.log(y:" + d.getDate())
          // console.log('d: ', d);
          this.days.push(d)
        }
        // 这个星期
        for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
          const d = new Date(str)
          d.setDate(d.getDate() + i)
          this.days.push(d)
          // console.log('d1: ', d);
        }
      },
      // 上个星期
      weekPre() {
        // const d = this.days[0] // 如果当期日期是7号或者小于7号
        const newd = this.days[this.tabIndex]
        newd.setDate(newd.getDate() - 7)
        // d.setDate(d.getDate() - 7)
        // this.initData(d)
        this.initData(newd)
        this.pick(moment(newd).format('YYYY-MM-DD'), this.tabIndex)
      },
      // 下个星期
      weekNext() {
        // const d = this.days[6] // 如果当期日期是7号或者小于7号
        // d.setDate(d.getDate() + 7)
        // this.initData(d)
        const newd = this.days[this.tabIndex]
        newd.setDate(newd.getDate() + 7)
        this.initData(newd)
        this.pick(moment(newd).format('YYYY-MM-DD'), this.tabIndex)
      },
      // 上一個月  传入当前年份和月份
      pickPre(year, month) {
        const d = new Date(this.formatDate(year, month, 1))
        d.setDate(0)
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      },
      // 下一個月  传入当前年份和月份
      pickNext(year, month) {
        const d = new Date(this.formatDate(year, month, 1))
        d.setDate(35)
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      },
      // 当前选择日期
      pick(date, index) {
        this.newDate = moment(date).format('YYYY-MM-DD')
        // console.log(this.newDate)
        this.$emit('dateValue', this.newDate)
        // console.log("index: ", index);
        this.tabIndex = index
        // alert(
        //   this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
        // );
      },
      pickTime(time, index) {
        // console.log('time: ', time);
        let timeObj = {
          time: [],
          onlyUser: time.user
        }
        timeObj.time.push(_.split(time.time, '~'))
        // console.log('timeArr: ', timeArr)
        this.$emit('timeValue', timeObj)
        // console.log("index: ", index);
        this.tabTimeIndex = index
        // alert(
        //   this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
        // );
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @media screen and (max-width: 1300px)
    .days
      li
        padding 5px 0 !important
  .today-item
    cursor pointer
    line-height 45px
  .selected
    height 57px !important
    box-sizing border-box
    color #fff !important
    background #409eff !important
  .item-wrapper
    display flex
    justify-content center
    align-items center
    flex-direction column
  .prev-btn, .next-btn
    cursor pointer
    display flex
    justify-content center
    align-items center
    // padding: 5px 10px;
    // border: 1px solid #ccc;
    .fa-icon
      font-size 18px
  .date
    font-size 14px
    margin-top 15px
    .time-range
      display flex
      justify-content space-around
      align-items center
      padding 10px 0
      span
        cursor pointer
        padding-bottom 5px
        border-bottom 3px solid #fff
        &:hover
          border-bottom 3px solid rgb(151, 198, 245)
        &:active
          border-bottom 3px solid rgb(151, 198, 245)
      .active
        border-bottom 3px solid #409eff
    .days
      display flex
      li
        cursor pointer
        padding 5px 10px
        border 1px solid #ccc
        border-right none
        list-style none
        flex 1
        text-align center
        display flex
        justify-content center
        align-items center
      .date-item
        &:hover
          background #dff0d8
        &:active
          background #dff0d8
      li:nth-last-child(1)
        border-right 1px solid #ccc
</style>
