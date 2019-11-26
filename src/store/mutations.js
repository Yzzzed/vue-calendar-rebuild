export default {
  userLogin (state, user) {
    state.user = user
    try {
      localStorage.user = user
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
  }
}
