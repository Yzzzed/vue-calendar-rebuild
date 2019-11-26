import moment from 'moment'

let user, time, token
let date = moment(new Date()).format('YYYY-MM-DD')
let onlyUser = false
try {
  if (localStorage.user) {
    user = localStorage.user
  }
} catch (e) {
  console.error(e)
}

export default {
  user,
  date,
  time,
  token,
  onlyUser
}
