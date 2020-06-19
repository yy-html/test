<template>
  <div class="storage-location">
    <div class="storage-location-header">
      <Breadcrumb v-if="!isDetail">
        <BreadcrumbItem>陈列管理</BreadcrumbItem>
        <BreadcrumbItem>布局陈列</BreadcrumbItem>
        <BreadcrumbItem>布局陈列列表 -- 调整陈列商品</BreadcrumbItem>
      </Breadcrumb>
      <div>
        
        <div class="action-buttons" v-if="shelfBaseInfo.areaCode">
          <Button type="default" @click="doGetEquipmentInfo" v-if="hasPermission('refresh')">刷新</Button>
          <Button type="default" @click="closeWindow" v-if="hasPermission('closeWindow')">关闭</Button>
          <Button type="primary" @click="downloadPicture"  v-if="hasPermission('downloadPicture')">导出</Button>
        </div>
      </div>
    </div>
    
    <div class="location-container" :class="{'hasRightDrawer': showRightDrawer, 'hasLeftDrawer': showLeftDrawer}">
     
      <div ref="locationContentBody" class="location-container-body">
        <div class="base-info">
          <h3 class="title">微仓陈列-{{shelfBaseInfo.areaCode}}</h3>
          <p class="baseInfo">
            <span><label class="label-name">库区编码：</label>{{shelfBaseInfo.areaCode}}</span>
            <span class="mgl10"><label class="label-name">存储条件: </label>{{shelfBaseInfo.storeConditionName}}</span> 
            <span class="mgl10" v-if="shelfBaseInfo.parentCategoryName"> <label class="label-name">品类：</label>{{shelfBaseInfo.parentCategoryName.join(',')}}</span>
          </p>
        </div>
        <!--层-->
        <div class="floor" v-for="(floor,fIndex) in shelfList" :key="fIndex">
          <div class="floor-name">{{floor.rowIndex}}层</div>
          <div class="floor-row" >
            <template v-if="floor.locationList">
              <shelf-item :hideBind="isDetail" :items="floor.locationList" :showPutInButton="true" @selected="changeLocation(arguments[0],arguments[1], fIndex )" @bindMaterial="bindMaterial" @unbindMaterial="unbindMaterial" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="hideLeftDrawer" v-if="!showLeftDrawer" @click.stop="showLeftDrawer=true">
      打开货架列表 》
    </div>
     <div class="hideRightDrawer" v-if="!showRightDrawer" @click.stop="showRightDrawer=true">
      打开调整商品 》
    </div>
    <Drawer v-model="showLeftDrawer" :mask="false" placement="left" width="240">
      <shelf-menu v-if="loadShelfMenu" :name="warehouseName" :warehouseCode="warehouseCode" :defaultAreaCode="areaCode" :selectedId="opendAreaId" @changeSelect="changeSelectShelf"/>
    </Drawer>
    <Drawer v-model="showRightDrawer" :mask="false"   class="location-detail" width="500">
        <div class="location-detail-body" >
          <div class="location-sku-list">
            <h3>库位原料详情</h3>
            <p class="mgb10"><span><label class="label-name">库位编码：</label>{{locationMaterialInfo.locationCode}}</span></p>
            <Table border :columns="skuColumns" :data="locationMaterialInfo.materialList"></Table>
          </div>
          <div class="sku-search" v-if="!isDetail && hasPermission('getShelveMaterialList')">
            <h3>可上架商品列表</h3>
            <sku-search v-if="currentShelf && currentShelf.areaId" ref="skuSearchTable" :selection.sync="selectionProduct" :areaId="currentShelf.areaId" :warehouseCode="warehouseCode" style="margin-top: 10px;"/>
          </div>
        </div>
    </Drawer>
  </div>
</template>
<script>
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import {scrollTop, canvasToImage, closeCurrentPage} from '@/utils';
import shelfItem from './components/shelfItem.vue';
import shelfMenu from './components/shelfMenu.vue';
import skuSearch from './components/skuSearch.vue';
import html2canvas from 'html2canvas';
import {cloneDeep} from 'lodash';
import {getLocationMaterialInfo, getEquipmentInfo, shelvesMaterials} from '@/apis/layout';
import {authMixin} from '@/mixins/auth.mixin.js';
import {MfbMixins} from '@mfb/pc-components-micro'
const {tipsMixin} = MfbMixins

export default {
  name: "dms-layout-warehouse-product",
  components: { shelfItem, shelfMenu, skuSearch },
  mixins: [tipsMixin, authMixin],
  props: {
    defaultAreaCode: '',
  },
  data() {
    return {
      loadShelfMenu: false,
      showRightDrawer: false,
      showLeftDrawer: false,
      // 是否是查看页面
      warehouseName: "",
      warehouseCode: "",
      locationMaterialInfo: {
        locationCode: '',
        materialList: []
      },
      // 可上架商品列表
      selectionProduct: [],
      // 当前选中货架信息
      currentShelf: {},
      areaCode: '',
      opendAreaId: "",
      shelfBaseInfo: {},
      shelfList: [],
      shelfListCopy: [],
      skuColumns: [{
        title: '原料信息',
        key: 'name',
        width: 120,
        sortable: true,
        render: (h, {row,  column, index}) => {
          return h('span', row.materialId + row.materialName)
        }
      }, {
        title: '单位',
        width: 80,
        key: 'unitValue'
      },  {
        title: '品类',
        width: 100,
        key: 'parentCategoryValue'
      },  {
        title: '锁货总量',
        width: 100,
        key: 'lockNum'
      },  {
        title: '库存数',
        width: 80,
        key: 'materialNum'
      },  {
        title: '7日销量',
        width: 100,
        key: 'sevenDaySaleNum'
      }],
    };
  },
  computed: {
    locationContainerStyle() {
      return {
        minHeight: '1000px'
      };
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.loadShelfMenu = false;

        this.warehouseCode = val.query.stationCode || '';
        this.warehouseName = val.query.stationName || '';
        
        this.areaCode = val.query.areaCode || '';
        this.isDetail = val.query.isDetail || 0;
        this.showRightDrawer = false;
        this.showLeftDrawer = false;

        this.$nextTick(() => {
          this.loadShelfMenu = true;
        })

      },
      immediate: true
    },
    defaultAreaCode: {
      handler(val) {
        if(val) {
          this.areaCode = val;
        }
        // console.log(val);
        
      },
      immediate: true
    }
  },
  methods: {
    async closeWindow() {
      closeCurrentPage();
    },
    async doGetEquipmentInfo() {
      if (this.currentShelf && this.currentShelf.areaId) {
        let res = await getEquipmentInfo({
          "warehouseCode": this.warehouseCode,
          "areaId": this.currentShelf.areaId,
          "showAllMaterial": 1
        })
        if(!this.$error(res)) return 
        this.shelfListCopy = cloneDeep(res.result.rowList);
        this.shelfList = res.result.rowList || [];
        this.shelfBaseInfo = res.result.areaBaseInfo || {};
        this.locationMaterialInfo = {
          locationCode: '',
          materialList: []
        }
        this.$forceUpdate();
      } else {
        // console.log('库区不存在')
      }
     
    },
    downloadPicture() {
      //下载商品陈列图片
      let vm = this;
      // 声明一个画布元素,存储需下载图片范围
      let canvas = document.createElement("canvas");
      let img = this.$refs['locationContentBody'];
      var w = parseInt(window.getComputedStyle(img).width);
      var h = parseInt(window.getComputedStyle(img).height);
      
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      html2canvas(img, {canvas: canvas, backgroundColor: '#eeeeee', scale: 1}).then(function(canvas) {
        canvasToImage(canvas, `${vm.warehouseName}微仓-${vm.shelfBaseInfo.areaCode}库区陈列图`)
      });
    },
    // 切换货架
    changeSelectShelf(shelf) {
      this.currentShelf = shelf
      this.doGetEquipmentInfo(shelf)
    },
    async changeLocation() {
      try {
        let location = arguments[0]
        let locationIndex = arguments[1]
        let fIndex = arguments[2]
        this.shelfList = cloneDeep(this.shelfListCopy)
        this.shelfList[fIndex]['locationList'][locationIndex]['_selected'] = 1
        let res = await getLocationMaterialInfo({
          "warehouseCode": this.warehouseCode,
          "locationId": location.locationId
        })
        if(!this.$error(res)) return;
        this.locationMaterialInfo = res.result;
        this.showRightDrawer = true;
       
      } catch(e) {
        console.log('changeLocation异常', e)
      }
      
    },
    selectLocationStyle(location) {
       this.shelfList && this.shelfList.map(item => {
        if(item.locationList && item.locationList.length) {
          item.locationList.map(item => {
            if(item.locationId == location.locationId) {
              item._selected = true
            } else {
              item._selected && delete item._selected
            }
            
          })
        }
      })

    },

    bindMaterial(locationId) {
      let params = {
        warehouseCode: this.warehouseCode,
        locationId,
        bindType: 1,
        materialIdList: this.selectionProduct.map(item=> item.materialId)
      }
      this.doShelvesMaterials(params);
    },
    async doShelvesMaterials(params) {
      if (params && params.materialIdList && params.materialIdList.length) {
        let res = await shelvesMaterials(params)

        if(!this.$error(res)) {
          this.doGetEquipmentInfo();
          return
        } 
        this.selectionProduct = []
        if(params.bindType === 1) {
          this.$Message.success('绑定原料成功');
        } else {
          this.$Message.success(`原料下架中，转移单号${res.result.transferNumberList}，请稍后刷新重试`)
        }
        
        this.doGetEquipmentInfo();
        this.$refs['skuSearchTable'].reloadData();
        this.changeLocation({
          locationId: params.locationId
        });
      } else {
        this.$Message.error('请选择原料')
      }
      

    },
    async unbindMaterial(locationId, materialId) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要下架该原料吗？',
        onOk: () => {
          let params = {
            warehouseCode: this.warehouseCode,
            locationId,
            bindType: 0,
            materialIdList:[materialId]
          }
          this.doShelvesMaterials(params);
        },
        onCancel: () => {
            // this.$Message.info('已取消');
        }
      });
      
    }
  }
};
</script>
<style lang="scss" scoped>
.hover-height-light {
  &:hover {
    box-shadow: inset 0px 0px 6px 0px #abcdf9;
  }
}
.storage-location {
  min-height: 1000px;
  background: #eee;
  overflow: auto;

  &-header {
    position: fixed;
    z-index: 999;
    top: 0;
    width: calc(100% - 15px);
    padding: 15px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    .title {
      font-size: 16px;
      line-height: 30px;
      font-weight: 500;
    }
    .base-info {
      font-size: 12px;
      color: #999;
      font-size: 13px;
    }
    .action-buttons {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
.bread-crumb-container {
  position: fixed;
  top: 0px;
  padding: 15px;
  z-index: 999;
  background: #fff;
  width: calc(100vw - 12px);
}
.shelf-menu-container {
  position: fixed;
  background: #fff;
  z-index: 999;
  width: 200px;
  min-height: 1000px;
}
.location-container {
  padding-left: 30px;
  padding-right: 30px;
  width: fit-content;
  background: #eee;
  &.hasRightDrawer {
    padding-right: 500px;
  }
  &.hasLeftDrawer {
    padding-left: 240px;
  }
  &-body {
    margin-top: 60px;
    background: #eee;
    
    .base-info {
      padding: 10px;
      background: #eee;
    }
    .floor {
      padding: 5px;
    
      .floor-row {
        position: relative;
        margin-bottom: -1px;
        display: flex;
        flex-wrap: nowrap;
        min-height: 150px;
        
      }
      .floor-name {
        width: 50px;
        left: 10px;
        font-size: 16px;
        line-height: 28px;
        position: relative;
        padding-left: 10px;
        margin-bottom: 5px;
        &:before {
          content: " ";
          display: block;
          width:3px;
          height: 100%;
          background: #2c8bef;
          position: absolute;
          left: 0;
        }
      }
    }
  }
  
}
.hideRightDrawer {
  top: 113px;
  position: fixed;
  right: 12px;
  background: #f90;
  color: #fff;
  padding: 10px 5px;
  letter-spacing: 5px;
  writing-mode: vertical-rl;
  cursor: pointer;
}
.hideLeftDrawer {
  top: 113px;
  position: fixed;
  left: 0;
  background: #f90;
  color: #fff;
  padding: 10px 5px;
  letter-spacing: 5px;
  writing-mode: vertical-rl;
  cursor: pointer;
}
.sku-search {
  margin-top: 10px;
}
</style>
