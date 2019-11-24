export default {
  methods: {
    formatURL (url) {
      if (url.indexOf(this.project.baseURL) === -1) {
        const params = 'from=mw'
        const symbol = url.indexOf('?') !== -1 ? '&' : '?'
        return url + symbol + params
      } else {
        return url
      }
    }
  }
}
