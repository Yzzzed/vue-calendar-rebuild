module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px2rem-exclude": {
      "remUnit": 10,
      "exclude": "/node_modules/i"
    }
  }
}
