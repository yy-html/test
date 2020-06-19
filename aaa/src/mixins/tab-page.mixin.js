// TabPage Mixin

export const tabPageMixin = {
  methods: {
    // 关闭当前标签页 并返回上一标签页
    closeCurrentPage (name) {
      // 关闭tab页
      window.MICRO_CLOSE_TAB(this.$route)
      if (!name) this.$router.go(-1)
      else this.$router.push({name})
    }
  }
}