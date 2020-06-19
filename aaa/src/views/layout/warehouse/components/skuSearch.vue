<template>
  <div class="skuSearch">
    <Form inline :label-width="80">
      <FormItem label="原料">
        <DMSFuzzyQuerySelect refName="FuzzyQuerySelectRef" :remoteMethod="getMaterialByWords" valName="id" keyName="id" queryKey="word" @on-change="changeMaterial"/>
      </FormItem>
      <FormItem label="品类" >
        <Select placeholder="全部" v-model="query.parentCategory" clearable filterable>
          <Option
            v-for="(item, index) in categoryOptions"
            :value="item.id"
            :key="index"
          >{{ item.caption }}</Option>
        </Select>
      </FormItem>
      <FormItem label="存储条件" >
        <Select placeholder="全部" v-model="query.storeCondition" clearable filterable>
          <Option
            v-for="(item, index) in storageConditionOptions"
            :value="item.id"
            :key="index"
          >{{ item.caption }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="doQuery" >查询</Button>
      </FormItem>
    </Form>
    <!-- <Table draggable border :columns="skuColumns" :data="skuData" @on-selection-change="onSelectionChange" @on-drag-drop="dragDrop"></Table> -->
     <MfbDataList
      :page-options="pageOptions"
      :table-options="tableOptions"
      :columns="skuColumns"
      :data="skuData"
      @on-page-size-change="onPageSizeChange"
      @on-selection-change="onSelectionChange"
      @on-change="onPageChange"
    />
  </div>
</template>
<script>
import {MfbMixins} from '@mfb/pc-components-micro'
const {tipsMixin} = MfbMixins
import {getCategorys,getSmsEnum, getEnum,getMaterialByWords } from '@/apis/common'
import {getShelveMaterialList } from '@/apis/layout'
export default {
  name: 'SkuSearch',
  mixins: [tipsMixin],
  props: {
    selection: {
      type: Array,
      default: () => []
    },
    warehouseCode: '',
    areaId: {
      type: Number
    }
  },
  data() {
    return {
      pageOptions: {
        pageNum: 1,
        pageSize:30,
        total: 0
      },
      tableOptions: {
        draggable: true,
        border: true
      },
      query: {
        pageNum: 1, 
        pageSize: 30,
        materialId: '',
        categoryId: '',
        storageCondition: '',
        // warehouseCode: '',
        // areaId: ''
      },
      // 品类Options
      categoryOptions: [],
      // 存储条件
      storageConditionOptions: [],
      groupList: [],
      skuData: {
        list: [],
        total: 0
      },
      skuColumns: [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },{
        title: '原料信息',
        key: 'materialName',
        width: 120,
        sortable: true,
        resizable: true,
        render: (h, { row, column, index }) => {
          return h('span', row.materialId +'-'+ row.materialName)
        }
      }, {
        title: '存储条件',
        key: 'storeConditionValue',
        width: 100,
      },  {
        title: '品类',
        key: 'parentCategoryValue',
        width: 80,
      },  {
        title: '库存数',
        key: 'materialNum',
        width: 80,
        resizable: true
      },  {
        title: '7日销量',
        key: 'sevenDaySaleNum',
        minWidth: 80,
      }],
    }
  },
  mounted() {
    this.getCategoryList();
    this.getStoreType();
  },
  methods: {
    changeMaterial(val) {
      if (val) {
        this.query.materialId = val.value
      } else {
        this.query.materialId = ''
      }
    },
    getMaterialByWords(query) {
      return getMaterialByWords({
        ...query,
        warehouseCode: this.warehouseCode,
        pageSize: 50,
        page: 1
      })
    },
    async getCategoryList() {
      let res = await getCategorys({
        warehouseCode: this.warehouseCode
      })
      if(!this.$error(res)) return 
      this.categoryOptions = res.result
    },
    async getStoreType() {
      let res = await getSmsEnum({
        type: 'STORECONDITION'
      })
      if(!this.$error(res)) return 
      this.storageConditionOptions = res.result
    },
    reloadData() {
      this.doQuery();
    },
    doQuery() {
      this.query.pageNum = 1;
      this.getShelveMaterialList();
    },
    async getShelveMaterialList() {
      let params = {
         ...this.query,
        areaId: this.areaId,
        warehouseCode: this.warehouseCode
      }
      let res = await getShelveMaterialList(params)
      if(!this.$error(res)) return 
      this.skuData.list = res.result.list || []
      this.skuData.total = res.result.total
    },
    onSelectionChange (selection) {
      this.$emit('update:selection', selection)
    },
    dragDrop(index1, index2) {
      console.log(index1, index2)
      // this.skuData.splice(index1, 1)
    },
    onPageChange(pageNum) {
      this.query.pageNum = pageNum
      this.getShelveMaterialList()
    },
    onPageSizeChange(pageSize) {
      this.query.pageSize = pageSize
      this.getShelveMaterialList()
    }
    
  }
}
</script>
<style lang="scss" scoped>
.skuSearch {
  .ivu-form-item {
    margin-bottom: 10px;
  }
}
</style>
