import theme from "@nuxt/content-theme-docs";

export default theme({
  router: {
    base: '/vue-api-query/'
  },
  hooks: {
    'vue-renderer:ssr:templateParams': function(params) {
      params.HEAD = params.HEAD.replace('<base href="/vue-api-query/">', '')
    }
  }
})
