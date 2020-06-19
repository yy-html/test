// 权限检查Mixin

import { mapState } from 'vuex'
export const authMixin = {

  computed: {
    ...mapState({
      // 权限菜单map对象
      accessMenuMap: state=>state.menu.accessMenuMap
    }),
    // 权限列表
    actionListPaths () {
      if (typeof this.accessMenuMap === 'object') {
        let path = this.$route.path
        // 处理带参数的动态路由
        if (this.$route.meta.active && Array.isArray(this.$route.matched) && this.$route.matched.length) {
          const matchedItem = this.$route.matched.find(item => !!item.path)
          let pathList = matchedItem.path.split(':')
          let tempPath = pathList[0]
          path = tempPath.substr(0, tempPath.length - 1)
        }
        const menu = this.accessMenuMap[path]
        if (typeof menu === 'object') {
          const actionList = menu.actionList
          if (Array.isArray(actionList)) {
            return actionList.map(item => item.path)
          }
        }
      }
      return []
    }
  },

  methods: {
    // 根据按钮标识判断是否有权限
    hasPermission(key) {
      return this.actionListPaths.indexOf(key) > -1
    }
  }
}