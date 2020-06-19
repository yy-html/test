<template>
  <div id="dms">
    <MfbMain :apiDomain="apiDomain">
      <div class="app-container">
        <keep-alive :exclude="exclude">
          <!-- 不能包transition -->
          <router-view :key="$route.fullPath" />
        </keep-alive>
      </div>
    </MfbMain>
  </div>
</template>

<script>
import { MfbMain } from '@mfb/pc-components-micro';
export default {
  name: 'DMS',
  data() {
    return {
      apiDomain: process.env.VUE_APP_API_ROOT,
      // 不keeplive页面
      exclude: [],
      pageComponentsWithIdRoute: [
        // 用到id路由的页面组件 比如 /a/b/:id 或者 /a/b/:id/:id 等
      ]
    };
  },
  components: {
    MfbMain
  },
  // 此处必须用created 不能用mounted
  created() {
    this.$store.dispatch({
      type: 'main/setMainConfig',
      data: {
        website: 'DMS'
      }
    });
    window.MICRO_REGISTER_CLOSE_EVENT(({ excludes }) => {
      // 注册方法，关闭页签时通过设置exclude清理keep-alive缓存
      // 把一定不缓存的页面组件名称加进去
      this.exclude = [...excludes, ...this.pageComponentsWithIdRoute];
    });
  }
};
</script>

<style lang="scss" scoped>
/deep/ .ivu-select-input[disabled],
/deep/ .ivu-input[disabled],
/deep/ fieldset[disabled] .ivu-input,
/deep/ .ivu-input-number-input[disabled],
/deep/ .ivu-select-disabled .ivu-select-selection {
  color: #515a6e !important;
}
#dms {
  height: 100%;
}
</style>
