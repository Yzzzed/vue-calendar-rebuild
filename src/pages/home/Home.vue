<template>
  <div class="home">
    <left-bar></left-bar>
    <right-calendar :eventList="currentList"></right-calendar>
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
      eventList: [],
      currentList: []
    }
  },
  computed: {
    ...mapState({
      currentDate: 'date',
      currentTime: 'time',
      ifOnlyUser: 'onlyUser'
    })
  },
  watch: {
    currentDate (val, oldVal) {
      console.log(val)
      axios.get(`/api/events/${val}`).then(this.handleEventList)
    },
    currentTime (val, oldVal) {
      if (val.onlyUser) {
        const userList = this.eventList.filter(event => {
          return event.performer.username === this.$store.state.user.username
        })
        this.currentList = userList
        return
      }
      const list = this.eventList.filter(event => {
        return moment(event.date).isBetween(
          `${this.currentDate} ${val.time[0][0]}`,
          `${this.currentDate} ${val.time[0][1]}`
        )
      })
      this.currentList = list
    }
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
    axios.get(`/api/events/${nowDate}`).then(this.handleEventList)
  },
  methods: {
    ...mapMutations(['setQueryDate']),
    handleEventList (res) {
      res = res.data
      if (res) {
        this.eventList = res
        this.currentList = this.eventList
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .home
    display flex
    min-height 100vh
</style>
