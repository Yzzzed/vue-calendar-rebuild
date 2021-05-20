import moment from 'moment'

let user, time, token, selectedDate
let date = moment(new Date()).format('YYYY-MM-DD')
let onlyUser = false
try {
  if (localStorage.getItem('user')) {
    user = localStorage.getItem('user')
  }
  if (localStorage.getItem('token')) {
    token = localStorage.getItem('user')
  }
} catch (e) {
  console.error(e)
}

export default {
  user,
  date,
  time,
  token,
  onlyUser,
  selectedDate
}
