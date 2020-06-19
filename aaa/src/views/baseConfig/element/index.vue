<template>
  <div class="dms-baseConfig-element-index">
    <mfb-page-table>
      <div slot="queryForm">
        <Form inline :label-width="110">
          <FormItem 
            label="设备归属" 
          >
            <Select
              v-model="vStore.queryParams.businessMode"
              clearable
              placeholder="全部"
            >
              <Option
                v-for="item in businessModeList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
          <FormItem 
            label="区域"
          >
            <Select
              placeholder="全部"
              v-model="vStore.queryParams.districtId"
              clearable
              filterable
              remote
              :remote-method="getDistrictList"
              :loading="districtLoading"
            >
              <Option v-for="(item, index) in districtList" :value="item.id" :key="index">{{item.districtCode}}/{{item.districtName}}</Option>
            </Select>
          </FormItem>
          <FormItem 
            label="设备编码" 
          >
            <Input v-model="vStore.queryParams.equipmentCode" clearable />
          </FormItem>
          <FormItem 
            label="设备名称" 
          >
            <Input v-model="vStore.queryParams.equipmentName" clearable />
          </FormItem>
          <FormItem 
            label="状态" 
          >
            <Select
              v-model="vStore.queryParams.equipmentStatus"
              clearable
              placeholder="全部"
            >
              <Option
                v-for="item in districtStatusList"
                :value="item.value"
                :key="item.value"
              >{{ item.key }}</Option>
            </Select>
          </FormItem>
          <FormItem 
            label="是否归属区域" 
          >
            <Select
              v-model="vStore.queryParams.equipmentBelong"
            >
              <Option
                v-for="item in equipmentBelongList"
                :value="item.value"
                :key="item.value"
              >{{item.key}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="query-buttons">
          <Button type="primary" @click="queryList">查询</Button>
          <Button type="primary" @click="resetQueryParams">清空查询条件</Button>
        </div>
      </div>
      <div class="action-buttons-container">
        <Button
          v-if="hasPermission('elementListAdd')"
          type="primary"
          class="mgl10"
          @click="addElement"
        >新增</Button>
        <Button
          v-if="hasPermission('elementListExport')"
          type="primary"
          class="mgl10"
          @click="exportList"
        >导出清单</Button>
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
      <ElementFormBox 
        v-if="modalVisible"
        :modalData="modalData"
        :businessModeList="businessModeList"
        :districtStatusList="districtStatusList"
        :equipmentBelongList="equipmentBelongList"
        :isEditing="!!modalType"
        @handleSubmit="handleModalSubmit"
        @handleCancel="onModalCancel"
        @mergeModalData="mergeModalData"
      />
    </Modal>
  </div>
</template>
<script>
import { listMixin } from "@/mixins/list.mixin";
import { authMixin } from '@/mixins/auth.mixin.js'
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import ElementFormBox from './components/elementFormBox'
import { getEnum } from '@/apis/common'
import {
  getElementList,
  getDistrictList,
  addElement,
  editElement,
  exportElementList
} from '@/apis/baseConfig/'

const initFormData = {
  businessMode: '',
  districtId: '',
  equipmentCode: '',
  equipmentName: '',
  length: '',
  width: '',
  height: '',
  equipmentStatus: 1,
  iconId: '',
  equipmentBelong: 1,
}
const initQueryParams = {
  equipmentBelong: 1,
}

export default {
  name: "dms-baseConfig-element-index",
  mixins: [listMixin, authMixin],
  components: {
    ElementFormBox,
  },
  data() {
    return {
      getListService: getElementList,
      vStore: {
        queryParams: {...initQueryParams}
      },
      modalVisible: false,
      modalType: 0,
      businessModeList: [],
      districtList: [],
      districtLoading: false,
      districtStatusList: [{
        key: '有效',
        value: 1
      },{
        key: '无效',
        value: 0
      }],
      equipmentBelongList: [{
        key: '是',
        value: 1
      }, {
        key: '否',
        value: 0
      }],
      tableOptions: {
        border: true
      },
      modalData: {},
      columns: [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          fixed: 'left'
        },
        {
          title: "设备归属",
          key: "businessModeName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "是否区域归属",
          key: "equipmentBelongName",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "区域编码",
          key: "districtCode",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "区域名称",
          key: "districtName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "设备编码",
          key: "equipmentCode",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "设备名称",
          key: "equipmentName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "状态",
          key: "equipmentStatusName",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "设备体积",
          minWidth: 120,
          render: (h, { row: { length = '', width = '', height = '' } }) => {
            return h('span', {}, `${length}*${width}*${height}`)
          }
        },
        {
          title: "长（mm）",
          key: "length",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "宽（mm）",
          key: "width",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "高（mm）",
          key: "height",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "更新时间",
          key: "updateTimeString",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "更新人",
          key: "updateUserName",
          minWidth: 150,
          tooltip: true,
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          fixed: 'right',
          render: (h, params) => {
            const btn = h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small",
                },
                on: {
                  click: () => {
                    this.editElement(params.row)
                  }
                }
              },
              '修改'
            )
            return this.hasPermission('elementListEdit') ? btn : null
          }
        }
      ]
    }
  },
  mounted() {
    this.getBusinessModeList()
    this.queryList()
  },
  methods: {
    resetQueryParams() {
      this.vStore.queryParams = {...initQueryParams}
    },

    getBusinessModeList() {
      const params = {
        enumType: 'business_mode'
      }
      getEnum(params).then(res => {
        if (res.code === 200) {
          const businessModeList = res.result.map(({ caption, id }) => ({ key: caption, value: id }))
          this.businessModeList = businessModeList
        }
      })
    },

    addElement() {
      this.modalType = 0
      this.setModalData(initFormData)
      this.onModalOpen()
    },
    editElement(row) {
      this.modalType = 1
      this.setModalData(row)
      this.onModalOpen()
    },
    exportList() {
      if (!this.listData.list.length) {
        return this.$Message.error('无数据可导出')
      }
      const params = this.vStore.queryParams
      exportElementList(params)
        .then(res => {
          if (res.code === 200) {
            const blob = new Blob([res.result], { type: 'application/x-xls' })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = '设备清单' + '.xls'
            link.click()
            this.$Message.success('导出成功')
            return
          }
          this.$Message.error(res.message)
        })
    },

    mergeModalData(data) {
      this.modalData = Object.assign(
        {},
        this.modalData,
        data
      )
    },
    setModalData(data) {
      this.modalData = {...data}
    },

    onModalOpen() {
      this.modalVisible = true
    },
    onModalCancel() {
      this.modalVisible = false
    },

    handleModalSubmit() {
      const fetchChangeList = [addElement, editElement][this.modalType]
      const {
        id,
        businessMode,
        districtId,
        equipmentCode,
        equipmentName,
        length,
        width,
        height,
        equipmentStatus,
        iconId,
        equipmentBelong,
      } = this.modalData
      const params = {
        id: id || null,
        businessMode,
        districtId,
        equipmentCode: equipmentCode.toUpperCase(),
        equipmentName,
        length: parseInt(length),
        width: parseInt(width),
        height: parseInt(height),
        equipmentStatus,
        iconId,
        equipmentBelong,
      }
      fetchChangeList(params)
        .then(res => {
          if (res.code === 200) {
            this.$Message.success('保存成功')
            this.onModalCancel()
            this.queryList()
            return
          }
          this.$Message.error(res.message)
        })
    },

    getDistrictList(query) {
      if (query !== '') {
        this.districtLoading = true
        const params = {
          districtIdAndName: query
        }
        getDistrictList(params).then(res => {
          if (res.code === 200) {
            this.districtList = res.result
            this.districtLoading = false
            return
          }
          this.$Message.error(res.message)
        })
      } else {
        this.districtLoading = false
        this.districtList = []
      }
    },

    unshiftItem(target) {
      return [{ key: '全部', value: -1 }, ...target]
    }
  },
  computed: {
    modalTitle() {
      return ['新增设备', '修改设备'][this.modalType]
    },
  }
};
</script>