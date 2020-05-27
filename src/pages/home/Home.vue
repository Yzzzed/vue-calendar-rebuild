<!--
 * @Author: your name
 * @Date: 2019-10-24 17:37:48
 * @LastEditTime: 2020-05-24 17:39:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-calendar-rebuild\src\pages\home\Home.vue
-->
<template>
  <div class="home">
    <left-bar :user="currentUser"></left-bar>
    <right-calendar :eventList="currentList" :userList="userList" @update="updateList"></right-calendar>
  </div>
</template>

<script>
import LeftBar from './components/LeftBar'
import RightCalendar from './components/RightCalendar'
import axios from 'axios'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
export default {
  name: 'Home',
  components: {
    LeftBar,
    RightCalendar
  },
  data () {
    return {
      listCount: 0,
      currentList: [],
      userList: [],
      user: null
    }
  },
  computed: {
    ...mapState({
      currentDate: 'date',
      currentTime: 'time',
      currentUser: 'user',
      ifOnlyUser: 'onlyUser'
    })
  },
  watch: {
    currentUser (val, oldVal) {
      this.user = val
    },
    currentDate (val, oldVal) {
      // axios.get(`/api/events/${val}`).then(this.handleEventList)
      axios.all([
        axios.get(`/api/events/${val}`),
        axios.get(`/api/events/${val}/${localStorage.userid}`)
      ]).then(axios.spread((allRes, userRes) => {
        this.handleEventList(allRes)
        this.handleuserList(userRes)
      }))
    }
    // currentTime (val, oldVal) {
    //   const list = this.eventList.filter(event => {
    //     return moment(event.date).isBetween(
    //       `${this.currentDate} ${val.time[0][0]}`,
    //       `${this.currentDate} ${val.time[0][1]}`
    //     )
    //   })
    //   this.currentList = list
    // }
    // ifOnlyUser (val, oldVal) {
    //   if (!val) {
    //     return
    //   }
    //   const list = this.eventList.filter(event => {
    //     return event.performer.username === this.$store.state.user.username
    //   })
    //   this.currentList = list
    // }
  },
  mounted () {
    const nowDate = this.currentDate || moment(new Date()).format('YYYY-MM-DD')
    axios.all([
      axios.get(`/api/events/${nowDate}`),
      axios.get(`/api/events/${nowDate}/${localStorage.userid}`)
    ]).then(axios.spread((allRes, userRes) => {
      this.handleEventList(allRes)
      this.handleuserList(userRes)
    }))
    // axios.get(`/api/events/${nowDate}`).then(this.handleEventList)
    // axios.get(`/api/events/${nowDate}/${localStorage.userid}`).then(this.handleuserList)
  },
  methods: {
    ...mapMutations(['setQueryDate']),
    handleEventList (res) {
      res = res.data
      if (res) {
        this.currentList = res
      }
    },
    handleuserList (res) {
      res = res.data
      if (res) {
        this.userList = res
      }
    },
    updateList (eventList, userList) {
      this.currentList = eventList
      this.userList = userList
    }
  }
}
</script>

<style lang="stylus" scoped>
  .home
    display flex
    min-height 100vh
</style>
