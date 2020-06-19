<template>
    <div class="location-container-district">
      <h3>{{name}}</h3>
      <div style="margin: 0 0px 10px 5px;display:flex;">
        <Input v-model="searchText" clearable enter-button="查询" placeholder="请输入库区(货架)编码"/>
        <Button type="primary" @click="searchShelf">查询</Button>
      </div>
      <template  v-if="reShowArea">
        <Collapse v-if="districtTree && districtTree.length" v-model="opendAreaId">
          <Panel v-for="district in districtTree" :name="district.districtId+''" :key="district.districtId">
            {{district.districtName}}
            <div slot="content">
              <div v-for="shelf in district.areaList" :key="shelf.id" class="shelf-item">
                <div @click.stop="selectShelf(shelf)">
                  {{shelf.areaCode}}
                </div>
                </div>
            </div>
          </Panel>
        </Collapse>
        <div v-else class="alignc pd10">
          暂无数据
        </div>
      </template>
    </div>
</template>
<script>
import { getEquipmentList } from '@/apis/layout';
import {cloneDeep } from 'lodash';
export default {
  name: 'ShelfMenu',
  props: {
    name: '',
    warehouseCode: '',
    defaultAreaCode: '',
  },
  
  data() {
    return {
      // warehouseCode: 'MRYXBJS-WULUJU',
      searchText: '',
      // 地址栏里区域Code
      queryAreaCode: '',
      opendAreaId: '',
      reShowArea: false,
      // 区域列表
      districtTreeCopy: [],
      districtTree: [],
      shelfObjs: {},
    }
  },
  mounted() {
  },
  watch: {
    // $route: {
    //   handler(val) {
    //     if (val && val.query && val.query.areaCode) {
    //       this.queryAreaCode = val.query.areaCode;
    //     }
    //   },
    //   immediate: true
    // },
    warehouseCode: {
      handler(nVal, oVal) {
        if(nVal) {
          console.log('warehouseCode')
          this.getAreaList(nVal)
        } else {
        }
      },
      immediate: true
    },
    defaultAreaCode: {
      handler(nVal, oVal) {
        if (nVal) {
          this.queryAreaCode = nVal;
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.getAreaList()
  },
  methods: {
    reLoadMenu() {
      this.reShowArea = false;
      this.$nextTick(() => {
        this.reShowArea = true;
      })
    },
    selectShelf(shelf) {
      this.$emit('changeSelect', shelf);
    },
    async getAreaList() {
      console.log('getAreaList')
      let res = await getEquipmentList({
        warehouseCode: this.warehouseCode
      })
      this.districtTreeCopy = cloneDeep(res.result)
      this.districtTree = res.result
      if (this.districtTree && this.districtTree.length) {
        // 默认第一个折叠区域打开
        this.opendAreaId = [this.districtTree[0].districtId+'']

        // 默认查询区域
        if (this.queryAreaCode) {
          this.searchText = this.queryAreaCode;
          this.searchShelf();
        } else {
          if(this.districtTree && this.districtTree[0] && this.districtTree[0].areaList) {
            this.selectShelf(this.districtTree[0].areaList[0])
            this.queryAreaCode = '';
          }
          this.reLoadMenu()
        }
      }
     
     
    },
    searchShelf() {
      try {
        let keyword = this.searchText;
        if(!keyword) {
          this.getAreaList();
          return;
        }
        this.districtTree = []
        let newDistrictList = []
        this.districtTreeCopy.map(item => {
          let areaList = item.areaList;
          item.show = false

          let newAreaList = []
          areaList && areaList.map(area => {
            area.show = false
            if (area && area.areaCode && area.areaCode.indexOf(keyword) > -1) {
              item.show = true
              newAreaList.push(area)
            }
          })
          if (item.show) {
            this.districtTree.push({
              districtId: item.districtId,
              districtName: item.districtName,
              areaList: newAreaList
            })
          }
        })
        if(this.districtTree && this.districtTree.length) {
          this.opendAreaId = this.districtTree.map(item => item.districtId)
        }
        this.reLoadMenu();
        if(this.queryAreaCode && this.districtTree && this.districtTree[0] && this.districtTree[0].areaList) {
          this.selectShelf(this.districtTree[0].areaList[0])
          this.queryAreaCode = '';
        }
      } catch(e) {
        console.log('查询货架报错，请检查数据库返回数据', e);
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
.location-container-district {
  height: 100%;
  h3 {
    padding: 5px 0 10px;
  }
  .shelf-item {
    padding: 10px 5px;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #f7f7f7;
      cursor: pointer;
    }
  }
}
/deep/ .ivu-collapse-content>.ivu-collapse-content-box {
  padding: 0;
}
/deep/ .ivu-collapse-content{
  padding: 0;
}
</style>
