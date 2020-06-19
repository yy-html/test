<template>
  <div class="dms-layout-warehouse-index">
    <mfb-page-table>
      <div slot="queryForm">
        <Form inline :label-width="110">
          <FormItem label="仓组">
            <Select
              v-model="vStore.queryParams.warehouseGroupCode"
              clearable
              filterable
              placeholder="全部"
            >
              <Option
                v-for="(item, index) in warehouseGroupList"
                :value="item.code"
                :key="index"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="城市">
            <Select v-model="vStore.queryParams.cityName" clearable filterable placeholder="全部">
              <Option v-for="(item, index) in cityList" :value="item" :key="index">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="军区">
            <Select
              v-model="vStore.queryParams.militaryRegionCode"
              clearable
              filterable
              placeholder="全部"
            >
              <Option
                v-for="(item, index) in militaryList"
                :value="item.code"
                :key="index"
              >{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="微仓">
            <Select 
              v-model="vStore.queryParams.stationCode"
              clearable
              filterable
              placeholder="全部"
              @on-query-change="filterStationList"
            >
              <Option
                v-for="(item, index) in stationListFiltration"
                :value="item.stationCode"
                :key="index"
              >{{item.stationName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="营业状态">
            <Select v-model="vStore.queryParams.status" clearable filterable placeholder="全部">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.key}}</Option>
            </Select>
          </FormItem>
          <FormItem label="微仓类型">
            <Select 
              v-model="vStore.queryParams.stationType" 
              clearable 
              filterable 
              placeholder="全部"
            >
              <Option
                v-for="item in stationTypeList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
          <FormItem label="经营方式">
            <Select
              v-model="vStore.queryParams.modeOperation"
              clearable
              filterable
              placeholder="全部"
            >
              <Option
                v-for="item in modeOperationList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否已使用陈列系统">
            <Select v-model="vStore.queryParams.enabledDms" clearable filterable placeholder="全部">
              <Option
                v-for="item in enabledDmsList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否已有布局图">
            <Select
              v-model="vStore.queryParams.existedLayout"
              clearable
              filterable
              placeholder="全部"
            >
              <Option
                v-for="item in existedLayoutList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="query-buttons">
          <Button type="primary" @click="queryList">查询</Button>
          <Button type="primary" @click="resetQuery">清空查询条件</Button>
        </div>
      </div>
      <div class="action-buttons-container">
        <Button
          v-if="hasPermission('exportLayout')"
          type="primary"
          class="mgl10"
          @click="handleExportLayout"
        >导出布局图</Button>
        <Button
          v-if="hasPermission('exportDisplay')"
          type="primary"
          class="mgl10"
          @click="handleExportDisplay"
        >导出陈列图</Button>
      </div>
    </mfb-page-table>

    <MfbDataList
      :page-options="vStore.pageOptions"
      :table-options="tableOptions"
      :columns="columns"
      :data="listData"
      @on-page-size-change="onPageSizeChange"
      @on-selection-change="onSelectionChange"
      @on-change="onPageChange"
    />
    <Modal
      :title="modalTitle"
      :mask-closable="false"
      v-model="modalVisible"
      footer-hide
      style="width:800px;"
      @on-cancel="onModalCancel"
    >
      <LayoutFormBox
        v-if="modalVisible && modalType === 0"
        :modalData="modalData"
        :isEditing="!!modalType"
        :enabledDmsList="enabledDmsList"
        :existedLayoutList="existedLayoutList"
        @handleSubmit="handleModalSubmit"
        @handleCancel="onModalCancel"
      />
    </Modal>
  </div>
</template>
<script>
import { listMixin } from '@/mixins/list.mixin';
import { MfbObjUtil } from '@mfb/pc-utils-micro';
import LayoutFormBox from './components/layoutFormBox';
import { getWarehouseGroupList, getCityList, getMilitaryList, getStationList } from '@/apis/common';
import {
  getLayoutList,
  updateLayout,
  exportLayout,
  exportDisplay,
} from '@/apis/layout';

const initQueryParams = {
  layoutType: 1
};

export default {
  name: 'dms-layout-warehouse-index',
  mixins: [listMixin],
  components: {
    LayoutFormBox
  },
  data() {
    return {
      warehouseGroupList: [],
      cityList: [],
      militaryList: [],
      stationList: [],
      stationListFiltration: [],
      statusList: [
        {
          key: '开站',
          value: 2
        },
        {
          key: '闭站',
          value: 3
        },
        {
          key: '闭站（筹备中）',
          value: 4
        },
      ],
      stationTypeList: [
        {
          key: '小猴子',
          value: 3
        },
        {
          key: '大猩猩',
          value: 4
        },
      ],
      modeOperationList: [
        {
          key: '自营',
          value: 2
        },
        {
          key: '承包商',
          value: 3
        }
      ],
      enabledDmsList: [
        {
          key: '否',
          value: 0
        },
        {
          key: '是',
          value: 1
        }
      ],
      existedLayoutList: [
        {
          key: '否',
          value: 0
        },
        {
          key: '是',
          value: 1
        }
      ],
      getListService: getLayoutList,
      vStore: {
        queryParams: { ...initQueryParams }
      },
      modalVisible: false,
      modalType: 0,
      tableOptions: {
        border: true
      },
      modalData: {},
      columns: [
        {
          type: 'selection',
          minWidth: 60,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '序号',
          type: 'index',
          minWidth: 60,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '仓组',
          key: 'warehouseGroupName',
          minWidth: 120,
          tooltip: true,
        },
        {
          title: '城市',
          key: 'city',
          minWidth: 120,
          tooltip: true,
        },
        {
          title: '军区',
          key: 'militaryRegionName',
          minWidth: 120,
          tooltip: true,
        },
        {
          title: '微仓编码',
          key: 'stationCode',
          minWidth: 200,
          tooltip: true,
        },
        {
          title: '微仓名称',
          key: 'stationName',
          minWidth: 200,
          tooltip: true,
        },
        {
          title: '营业状态',
          key: 'statusName',
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "经营方式",
          key: "modeOperationName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: '是否已使用陈列系统',
          key: 'enabledDmsName',
          minWidth: 130,
          tooltip: true,
        },
        {
          title: '是否已有布局图',
          key: 'existedLayoutName',
          minWidth: 110,
          tooltip: true,
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 300,
          fixed: 'right',
          render: (h, params) => {
            let arr = [];
            let ids = [
              {
                name: '查看',
                permission: 'detail',
                type: 'success',
                method: 'toDetail'
              },
              {
                name: '修改',
                permission: 'edit',
                type: 'warning',
                method: 'updateLayout'
              },
              {
                name: '绘制布局图',
                permission: 'drawArea',
                type: 'primary',
                method: 'toDrawArea'
              },
              {
                name: '匹配货架',
                permission: 'matchShelf',
                type: 'primary',
                method: 'toMatchShelf'
              },
              {
                name: '调整库区库位',
                permission: 'adjustArea',
                type: 'primary',
                method: 'toMatchShelfLocation'
              },
              {
                name: '调整陈列商品',
                permission: 'adjustShelf',
                type: 'primary',
                method: 'toMatchShelfProduct'
              }
            ];
            // if (params.row.commitFlag == 0 &&  this.hasPermission('edit')) {
            //   ids.push({
            //     id: "edit",
            //     name: "编辑",
            //     method: "toEdit",
            //     type: "primary"
            //   });
            // }

            ids.forEach(item => {
              if (this.hasPermission(item.permission)) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: item.type || 'primary',
                        size: 'small',
                        icon: item.icon
                      },
                      on: {
                        click: () => {
                          this[item.method](params.row);
                        }
                      }
                    },
                    item.name
                  )
                );
              }
            });

            return h('div', arr);
          }
        }
      ]
    };
  },
  mounted() {
    this.getEnumList();
    this.queryList();
  },
  methods: {
    filterStationList(query) {
      if (query !== '') {
        const r = query.toUpperCase()
        this.stationListFiltration = this.stationList.filter(item => item.stationName.includes(r) || item.stationCode.includes(r))
      } else {
        this.stationListFiltration = []
      }
    },
    getEnumList() {
      Promise.all([getWarehouseGroupList(), getCityList(), getMilitaryList(), getStationList()]).then(([warehouseGroupList, cityList, militaryList, stationList]) => {
        this.warehouseGroupList = warehouseGroupList.result;
        this.cityList = cityList.result;
        this.militaryList = militaryList.result;
        this.stationList = stationList.result;
      });
    },
    toDetail(row) {
      window.open(`/#/dms/layout/warehouse/detail?newWindow=true&noBrainNav=true&stationCode=${row.stationCode}&stationName=${row.stationName}&isDetail=1`, 'micro')
    },
    toDrawArea(row) {
      window.open(`#/dms/layout/warehouse/region?newWindow=true&noBrainNav=true&stationCode=${row.stationCode}&stationName=${row.stationName}`, 'micro');
    },
    toMatchShelf(row) {
      this.$router.push({
        path:'/dms/layout/warehouse/region',
        query:{
          bindDevice:'1',
          stationCode:row.stationCode,
          stationName:row.stationName
        }
      })
    },
    toMatchShelfLocation(row) {
      window.open(`/#/dms/layout/warehouse/slocation?newWindow=true&noBrainNav=true&stationCode=${row.stationCode}&stationName=${row.stationName}`, 'micro')
    },
    toMatchShelfProduct(row) {
      window.open(`/#/dms/layout/warehouse/product?newWindow=true&noBrainNav=true&stationCode=${row.stationCode}&stationName=${row.stationName}`, 'micro')
    },

    updateLayout(row) {
      this.modalType = 0;
      this.setModalData(row);
      this.onModalOpen();
    },
    setModalData(data) {
      this.modalData = { ...data };
    },

    onModalOpen() {
      this.modalVisible = true;
    },
    onModalCancel() {
      this.modalVisible = false;
    },

    handleModalSubmit() {
      const { dmsId, enabledDms, stationCode, stationName } = this.modalData;
      const params = {
        dmsId,
        enabledDms,
        stationCode,
        stationName,
        layoutType: 1
      };
      updateLayout(params).then(res => {
        if (res.code === 200) {
          this.$Message.success('保存成功');
          this.onModalCancel();
          this.queryList();
          return;
        }
        this.$Message.error(res.message);
      });
    },

    handleExportLayout() {
      const { length } = this.selectionData
      if (!length) {
        return this.$Message.error('请选择微仓！')
      } else if (length > 10) {
        return this.$Message.error('微仓数据超过10条，请重新选择！')
      } else if (this.selectionData.find(({ existedLayout }) => existedLayout == 0)) {
        return this.$Message.error('请选择已有布局图的微仓！')
      }

      const params = {
        stationCodes: this.selectionData.map(({ stationCode }) => stationCode)
      }
      exportLayout(params).then(res => {
        if (res.code == 200) {
          this.exportFile({
            blob: [res.result],
            type: 'application/zip',
            fileName: '微仓布局图.zip'
          })
          this.$Message.success('导出成功')
          return
        }
        this.$Message.error(res.message)
      })
    },
    handleExportDisplay() {
      const { length } = this.selectionData
      if (!length) {
        return this.$Message.error('请选择的微仓！')
      } else if (length > 1) {
        return this.$Message.error('只能选择一个微仓导出陈列数据！')
      }

      const params = {
        stationCodes: this.selectionData.map(({ stationCode }) => stationCode)
      }
      exportDisplay(params).then(res => {
        if (res.code == 200) {
          this.exportFile({
            blob: [res.result],
            type: 'application/x-xls',
            fileName: `${this.selectionData[0].stationName}-微仓陈列图.xls`
          })
          this.$Message.success('导出成功')
          return
        }
        this.$Message.error(res.message)
      })
    },

    exportFile({ blob, type, fileName }) {
      const result = new Blob(blob, { type })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(result)
      link.download = fileName
      link.click()
    },

    resetQuery() {
      this.$set(this.vStore, 'queryParams', { ...initQueryParams })
    }
  },
  computed: {
    modalTitle() {
      return ['修改'][this.modalType];
    }
  },
  watch: {
    'listData.list': function() {
      this.resetSelectionChange()
    }
  }
};
</script>
<style scoped lang="scss">
.dms-layout-warehouse-index {
  /deep/.ivu-table-cell.ivu-table-cell-with-selection {
    padding: 0 !important;
  }
}
</style>