<template>
  <div class="storage-location">
    <Breadcrumb :style="{margin: '10px 0'}">
      <BreadcrumbItem>陈列管理</BreadcrumbItem>
      <BreadcrumbItem>布局陈列</BreadcrumbItem>
      <BreadcrumbItem>布局陈列列表 -- 调整陈列库位</BreadcrumbItem>
    </Breadcrumb>
    <Row class="location-container" v-if="warehouseCode">
      <Col span="4" :style="locationContainerStyle">
        <shelf-menu  :name="warehouseName" :warehouseCode="warehouseCode"  :defaultAreaCode="areaCode" @changeSelect="changeSelectShelf"/>
      </Col>
      <Col span="20" style="height:100%;">
        <div class="location-container-content-header">
          <h3 class="title">微仓陈列-{{shelfBaseInfo.areaCode}}</h3>
          <p class="baseInfo">
            <span><label class="label-name">库区编码：</label>{{shelfBaseInfo.areaCode}}</span>
            <span class="mgl10"><label class="label-name">存储条件: </label>{{shelfBaseInfo.storeConditionName}}</span> 
            <span class="mgl10" v-if="shelfBaseInfo.parentCategoryName"> <label class="label-name">品类：</label>{{shelfBaseInfo.parentCategoryName.join(',')}}</span>
          </p>
          <div class="action-buttons" v-if="shelfBaseInfo.areaCode" >
            <Button type="default" @click="closeWindow" v-if="hasPermission('closeWindow')">关闭</Button>
            <Button type="primary" @click="toMatchShelfProduct" v-if="hasPermission('toMatchShelfProduct')">调整陈列商品</Button>
          </div>
        </div>
        <div ref="locationContentBody" class="location-container-content-body">
          <!--层-->
          <div class="floor" v-for="(floor,fIndex) in shelfList" :key="fIndex">
             <div class="floor-name">{{floor.rowIndex}}层</div>
              <div class="floor-row" >
                <template v-if="floor.locationList">
                  <shelf-item :items="floor.locationList" @deleteLocal="deleteLocal" />
                </template>
                <div class="add-column pointer" v-if="hasPermission('addEquipmentLocation')">
                  <div class="add-column-box hover-height-light" @click="addColumn(floor)"><Icon type="md-add" />添加库位</div>
                </div>
              
            </div>
          </div>
          <div v-if="shelfBaseInfo && shelfBaseInfo.areaCode && hasPermission('addEquipmentLocation')" class="add-row pointer hover-height-light" @click="addRow"><Icon type="md-add" />添加层</div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import {scrollTop, closeCurrentPage} from '@/utils';
import shelfItem from './components/shelfItem.vue';
import shelfMenu from './components/shelfMenu.vue';

import {getEquipmentInfo, getEquipmentList, addEquipmentLocation, deleteEquipmentLocation} from '@/apis/layout';

import {MfbMixins} from '@mfb/pc-components-micro'
const {tipsMixin} = MfbMixins

import {authMixin} from '@/mixins/auth.mixin.js';

export default {
  name: "dms-layout-warehouse-slocation",
  components: { shelfItem, shelfMenu },
  mixins: [tipsMixin, authMixin],
  data() {
    return {
      warehouseCode: '',
      warehouseName: "",
      areaCode: '',
      isCollapsed: false,
      minusHeight: "130px",
      currentShelfCode: 'RA01',
      currentShelf: {},
      shelfBaseInfo: {},
      opendAreaId: "",
      shelfList: []
    };
  },
  computed: {
    ...mapState({
      // 当前用户
      stateUser: state=>state.user.userInfo.data
    }),
    locationContainerStyle() {
      return {
        height: "calc(100vh - 100px)"
      };
    }
  },
  watch: {
    $route: {
      handler(val) {
        console.log('$route change',val);
        this.warehouseCode = val.query.stationCode || '';
        this.warehouseName = val.query.stationName || '';
        this.areaCode = val.query.areaCode || '';
      },
      immediate: true
    }
  },
  methods: {
    async doGetEquipmentInfo() {
      try {
        let res = await getEquipmentInfo({
          "warehouseCode": this.warehouseCode,
          "areaId": this.currentShelf.areaId,
          "showAllMaterial": 0
        })
        if(!this.$error(res)) return 
        this.shelfList = res.result.rowList || []
        this.shelfBaseInfo = res.result.areaBaseInfo || {}
      }
      catch(e) {
        console.log('doGetEquipmentInfo 当前区域无货架', e)
      }
    },
    async addColumn(floor) {
      if(floor && floor.locationList) {
        let locationLen = floor.locationList.length;
        let lastLocation = floor.locationList[locationLen -1];
        let locationCodeArr = lastLocation.locationCode.split('-');
        if (locationCodeArr && locationCodeArr[2]) {
          let newLocationIndex = parseInt(locationCodeArr[2]) + 1;
          let newLocationIndexStr = newLocationIndex < 10 ? `0${newLocationIndex}`: newLocationIndex;
          let newLocationCode = `${locationCodeArr[0]}-${locationCodeArr[1]}-${newLocationIndexStr}`;
          this.doAddEquipmentLocation(newLocationCode);
        }
      } else {
        this.$Message.error('行信息错误')
      }
    },
    async doAddEquipmentLocation(locationCode) {
      let res = await addEquipmentLocation({
        warehouseCode: this.warehouseCode,
        areaId: this.currentShelf.areaId,
        locationCode,
        userId: this.stateUser.sysUser.userId
      })
      this.doGetEquipmentInfo();
      if(!this.$error(res)) return ;
      this.$Message.success('添加库位成功');
      
    
    },
    addRow() {
      let newRowShelf = 1
      if(this.shelfList && this.shelfList.length) {
        newRowShelf = this.shelfList[this.shelfList.length-1].rowIndex + 1;
      }
      let newLocationCode = `${this.shelfBaseInfo.areaCode}-${newRowShelf}-01`;
      this.doAddEquipmentLocation(newLocationCode);
    },
    async deleteLocal(location) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除(禁用)该库位吗？',
        onOk: () => {
          this.doDelete(location)
        },
        onCancel: () => {
            // this.$Message.info('已取消');
        }
      });
    },
    async doDelete(location) {
      let res = await deleteEquipmentLocation({
        warehouseCode: this.warehouseCode,
        locationId: location.locationId,
        userId: this.stateUser.sysUser.userId
      })
      if(this.$error(res)) {
        this.$Message.success('删除库位成功');
      }
      this.doGetEquipmentInfo();
    },
    changeSelectShelf(shelf) {
      this.currentShelf = shelf;
      this.doGetEquipmentInfo()
    },
    closeWindow() {
      closeCurrentPage();
    },
    toMatchShelfProduct(row) {
      window.open(`/#/dms/layout/warehouse/product?newWindow=true&noBrainNav=true&stationCode=${this.warehouseCode}&stationName=${this.warehouseName}&areaCode=${this.shelfBaseInfo.areaCode}`, 'micro')
    },
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
  padding: 10px;
  .location-container {
    border: 1px solid #dcdee2;
    
    &-content {
      &-header {
        background: #f1f2f5;
        padding: 10px;
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
      }
      &-body {
        height: calc(100vh - 173px);
        background: #f1f2f5;
        overflow: auto;
        .floor {
          padding: 10px;
          width: max-content;

          .floor-row {
            position: relative;
            margin-bottom: -1px;
            display: flex;
            flex-wrap: nowrap;
            
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
       
        .add-row {
          padding: 20px;
          text-align: center;
          border: 1px dashed #2c8bef;
          color: #2c8bef;
          font-weight: 500;
          width: 100%;
          background: #fff;

        }
        .add-column {
          display: table-cell;
          border: 1px dashed #2c8bef;
          color: #2c8bef;
          font-weight: 500;
          
         
          .add-column-box {
            display: inline-flex;
            width: 130px; 
            height: 100%;
            text-align: center;
            justify-content: center;
            align-items: center;
            
          }
        }
      }
    }
  }
}
.sku-search {
    margin-top: 20px;
  }
.pointer {
  cursor: pointer;
}
.action-buttons {
  position: absolute;
  top:10px;
  right: 10px;
}
.label-name {
  color: #999;
}
</style>
