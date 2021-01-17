import theme from "@nuxt/content-theme-docs";

export default theme({
  router: {
    base: '/vue-api-query/'
  },
  /**
   * Workaround to fix router base issue.
   *
   * See https://github.com/robsontenorio/vue-api-query/issues/165
   * See https://github.com/nuxt/content/issues/376#issuecomment-702193217
   */
  hooks: {
    'vue-renderer:ssr:templateParams': function(params) {
      params.HEAD = params.HEAD.replace('<base href="/vue-api-query/">', '')
    }
  }
})
