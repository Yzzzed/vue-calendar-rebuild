<template>
  <div class="left-bar">
    <div class="calendar-container">
      <!-- <ele-calendar
        :render-content="renderContent"
        :data="datedef"
        :prop="prop"
        :highlight="true"
        :border="true"
        :lunarcalendar="true"
        value-format="yyyy-MM-dd"
      ></ele-calendar>-->
      <date-picker
        v-model="calDate"
        :inline="true"
        format="YYYY-MM-DD"
        value-type="format"
        @change="setDay"
      ></date-picker>
    </div>
    <div class="todolist-container">
      <todo-list></todo-list>
    </div>
  </div>
</template>

<script>
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/zh-cn'
import TodoList from './TodoList'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'LeftBar',
  components: {
    eleCalendar,
    DatePicker,
    TodoList
  },
  data () {
    return {
      datedef: [],
      prop: 'date',
      calDate: null
    }
  },
  computed: {
    ...mapState({
      currentDate: 'date'
    })
  },
  methods: {
    ...mapMutations(['setQueryDay']),
    setDay (date) {
      this.setQueryDay(date)
    }
    // renderContent (h, parmas) {
    //   const loop = data => {
    //     return data.defvalue.value ? (
    //       <div class="date-container">
    //         <div class="date-day">{data.defvalue.text}</div>
    //         <div class="date-lunar">{data.defvalue.Lunar.lDayChinese}</div>
    //       </div>
    //     ) : (
    //       <div>
    //         <div>{data.defvalue.text}</div>
    //         <div>{data.defvalue.Lunar.lDayChinese}</div>
    //       </div>
    //     )
    //   }
    //   return <div style="min-height:.259259rem;">{loop(parmas)}</div>
    // }
  },
  watch: {
    calDate (val) {
      this.setDay(val)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .left-bar
    width 27.5%
    min-height 100vh
    background #90CBED
    padding 0 0.185185rem /* 10/54 */
    display flex
    flex-direction column
    .date-container
      font-size 0.222222rem
    .is-selected
      color #1989FA
  >>>.mx-calendar-content
    width 100%
</style>
