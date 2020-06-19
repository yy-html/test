<template>
  <div class="detail-page" ref="detailPage">
    <Tabs :animated="false" type="card" v-model="tabName">
      <TabPane label="布局图" name="region">
        <region  class="region-tab" @detailJump="detailJump"/>
      </TabPane>
      <TabPane label="陈列商品" name="product">
        <product :defaultAreaCode="areaCode" v-if="refreshProduct"/>
      </TabPane>
     
    </Tabs>
  </div>
</template>
<script>
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import {MfbMixins} from '@mfb/pc-components-micro'
const {tipsMixin} = MfbMixins;
import Product from './product.vue';
import Region from './region/region.vue';
import {scrollTop} from '@/utils/index.js';

export default {
  name: "dms-layout-warehouse-detail",
  components: {
    Product,
    Region,
  },
  data() {
    return {
      tabName: 'region',
      areaCode: '',
      refreshProduct: true
    }
  },
  methods: {
    detailJump(area) {
      this.refreshProduct = false
      
      this.areaCode = area.areaCode;
      this.tabName = 'product';
      document.querySelectorAll('.layout-view-container.ivu-layout.fullScreenLayout')[0].scrollTop = 0;
      
      this.$nextTick(() => {
        this.refreshProduct = true;
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.detail-page {
  /deep/.ivu-tabs-bar {
    background: #fff;
    z-index: 1000;
    position: fixed;
    width: calc(100% - 13px);
    padding-top: 10px;
    padding-left: 5px;
  }
  /deep/.region-tab {
    &.page {
      .leftArea {
        top: 42px;
      }
      .btns {
        top: 41px;
        right: 12px;
      }
    }
  }
  /deep/.storage-location {
    margin-top: 20px;
    .storage-location-header {
      top: 42px;
      padding: 0;
      border-bottom: none;
    }
    .location-container-body {
      margin-top: 20px;
    }
    .hideLeftDrawer, .hideRightDrawer {
      top:135px;
    }
  }
  

}
</style>

