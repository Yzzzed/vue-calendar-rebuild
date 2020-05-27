export default {
  userLogin (state, user) {
    state.user = user
    try {
      localStorage.userid = user.id
      localStorage.username = user.username
      localStorage.nickname = user.nickname
    } catch (e) {}
  },
  userLogout (state) {
    state.user = undefined
  },
  setToken (state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  setQueryDate (state, date) {
    state.date = date
  },
  setQueryTime (state, time) {
    state.time = time
  },
  setQueryUser (state, onlyUser) {
    state.onlyUser = onlyUser
  },
  setQueryDay (state, date) {
    state.selectedDate = date
  }
}
