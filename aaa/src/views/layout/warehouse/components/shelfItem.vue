<template>
  <div class="location-row-container">
    <div v-for="(item,lIndex) in items" :key="lIndex"  >
      <!--库位-->
      <div v-if="showPutInButton"  class="item" :class="{'actived': item._selected}" style="min-width: 175px;">
        <div class="item-body"  @click.stop="selectItem(item, lIndex)">
          <div class="item-name">
            <p class="item-code">{{item.locationCode}}</p>
            <p class="item-num" ><b>{{item.locationBindNum}}</b> 种原料</p>
            <div v-if="!hideBind && hasPermission('shelvesMaterials')">
              <Button type="primary" size="small" class="mini-button" @click="bindMaterial(item)">绑定</Button>
            </div>
          </div>
          <!--sku-->
          <template v-if="item.materialList && item.materialList.length">
            <div class="item-sku" v-for="(sku,sIndex) in item.materialList" :key="sIndex">
              <div class="mgb10">
                <p>{{sku.materialId}}</p>
                <p>{{sku.materialName}}</p>
              </div>
              <Row>
                <Col span="12">
                  <p class="fz16"><b>{{sku.materialNum}}</b></p>
                  <p class="fz12">当前库存</p>
                </Col>
                <Col span="12">
                  <p class="fz16"><b>{{sku.sevenDaySaleNum}}</b></p>
                  <p class="fz12">7日销量</p>
                </Col>
              </Row>
              <div class="mgt10" v-if="!hideBind && hasPermission('shelvesMaterials') ">
                <Button type="warning" size="small" class="mini-button" @click="unbind(item, sku)">下架</Button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="item item-simple">
        <div class="item-body item-body-simple" >
          <p class="item-code">{{item.locationCode}}</p>
          <p ><b class="fz16">{{item.locationBindNum}}</b> 种原料</p>
          <div class="delete-button" v-if="item.locationBindNum == 0 && hasPermission('deleteEquipmentLocation') ">
            <Button type="warning" class="mini-button"  @click="deleteLocal(item)">删除(禁用)</Button>

          </div>
        </div>
      </div>
    </div>
   
  </div>
</template>
<script>
import {authMixin} from '@/mixins/auth.mixin.js';
export default {
  name: "item",
  mixins: [authMixin],
  props: {
    //隐藏上下架按钮, 默认显示
    hideBind: false,
    showPutInButton: false,
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  watch: {
    items: {
      handler(newVal){
        // console.log(newVal)
      },
      immediate: true,
      deep: true
    },
    hideBind: {
      handler(newVal) {
      },
      immediate: true
    }
  },
  data() {
    return {};
  },
  methods: {
    selectItem(item, index) {
      if (!item._selected) {
        item._selected = 1;
      }
      this.$emit('selected', item, index)
      // this.$forceUpdate();
      
    },
    deleteLocal(item) {
      console.log('delete local', item);
      this.$emit('deleteLocal', item);
    },
    bindMaterial(item) {
      this.$emit('bindMaterial', item.locationId, 1)
    },
    unbind(location, sku) {
      this.$emit('unbindMaterial', location.locationId, sku.materialId)
    }
  }
};
</script>
<style lang="scss" scoped>
.location-row-container {
  display: inline-flex;
}
.item {
  // display: inline-flex;
  display: inline-flex;
  font-size: 12px;
  text-align: left;
  flex-direction: column;
  position: relative;
  color: #333;
  margin-right: 5px;
  min-width: 130px;
  border:1px solid #f1f2f5;
  &.bindMaterial {
    width: 175px;
  }
  
  // &:last-child {
  //   border-right: 1px solid #ddd;
  // }
   &:hover, &.actived {
      border: 1px solid #2c8bef;
      
    }

  // .actions {
  //   padding: 5px;
  //   border-bottom: 1px solid #ddd;
  // }
  &-body {
    &-simple {
      padding: 10px;
      line-height: 30px;
      width: 100%;
      background: #fff;
      .item-code {
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
    .item-name {
      text-align: left;
      color: #333;
      font-size: 14px;
      background: #fff;
      padding: 5px 10px;
      .item-code {
        font-size: 16px;
        text-align: left;
        color: #333;
        font-weight: 500;
      }
      .item-num {
        margin: 2px 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  &-sku {
    background: #f8f9fe;
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
  }
  .delete-button {
    padding-top: 20px;
  }
  
}
.item-simple {
  border: 1px solid #f1f2f5;
  min-height: 100%;
  background: #fff;
}
.mini-button {
    font-size: 12px !important;
    padding: 0 10px;
  }

</style>
