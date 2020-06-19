<template>
  <div class="dms-baseConfig-area-index">
    <mfb-page-table>
      <div slot="queryForm">
        <Form inline :label-width="110">
          <FormItem 
            label="区域归属" 
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
              >{{ item.key }}</Option>
            </Select>
          </FormItem>
          <FormItem 
            label="区域编码" 
          >
            <Input v-model="vStore.queryParams.districtCode" clearable />
          </FormItem>
          <FormItem 
            label="区域名称" 
          >
            <Input v-model="vStore.queryParams.districtName" clearable />
          </FormItem>
          <FormItem 
            label="状态" 
          >
            <Select
              v-model="vStore.queryParams.districtStatus"
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
        </Form>
        <div class="query-buttons">
          <Button type="primary" @click="queryList">查询</Button>
          <Button type="primary" @click="resetQueryParams">清空查询条件</Button>
        </div>
      </div>
      <div class="action-buttons-container">
        <Button
          v-if="hasPermission('areaListAdd')"
          type="primary"
          class="mgl10"
          @click="addArea"
        >新增</Button>
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
      <AreaFormBox 
        v-if="modalVisible"
        :modalData="modalData"
        @mergeModalData="mergeModalData"
        :businessModeList="businessModeList"
        :districtStatusList="districtStatusList"
        :isEditing="!!modalType"
        @handleSubmit="handleModalSubmit"
        @handleCancel="handleModalCancel"
      />
    </Modal>
  </div>
</template>
<script>
import { listMixin } from "@/mixins/list.mixin"
import { authMixin } from '@/mixins/auth.mixin.js'
import { MfbObjUtil } from "@mfb/pc-utils-micro"
import AreaFormBox from './components/areaFormBox'
import { getEnum } from '@/apis/common'
import {
  getRegionList,
  addRegion,
  editRegion,
} from '@/apis/baseConfig/'

const initFormData = {
  businessMode: '',
  districtCode: '',
  districtName: '',
  color: '',
  districtStatus: 1,
}

export default {
  name: "dms-baseConfig-area-index",
  mixins: [listMixin, authMixin],
  components: {
    AreaFormBox,
  },
  data() {
    return {
      getListService: getRegionList,
      modalVisible: false,
      modalType: 0,
      businessModeList: [],
      districtStatusList: [{
        key: '有效',
        value: 1
      },{
        key: '无效',
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
          title: "区域归属",
          key: "businessModeName",
          minWidth: 120,
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
          title: "状态",
          minWidth: 90,
          key: "districtStatusName",
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
                    this.editArea(params.row)
                  }
                }
              },
              '修改'
            )
            return this.hasPermission('areaListEdit') ? btn : null
          }
        }
      ]
    };
  },
  
  mounted() {
    this.getBusinessModeList()
    this.queryList()
  },
  
  methods: {
    getBusinessModeList() {
      const params = {
        enumType: 'business_mode'
      }
      getEnum(params).then(res => {
        if (res.code === 200) {
          const businessModeList = res.result.map(({ caption, id }) => ({ key: caption, value: id }))
          this.businessModeList = businessModeList
          return
        }
        this.$Message.error(res.message)
      })
    },

    addArea() {
      this.modalType = 0
      this.setModalData(initFormData)
      this.onModalOpen()
    },
    editArea(row) {
      this.modalType = 1
      this.setModalData(row)
      this.onModalOpen()
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
      const fetchChangeList = [addRegion, editRegion][this.modalType]
      const {
        id,
        districtCode,
        districtName,
        districtStatus,
        businessMode,
        color,
      } = this.modalData
      const params = {
        id: id || null,
        districtCode: districtCode.toUpperCase(),
        districtName,
        districtStatus,
        businessMode,
        color
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
    handleModalCancel() {
      this.onModalCancel()
    }
  },
  computed: {
    modalTitle() {
      return ['新增区域', '修改区域'][this.modalType]
    },
  }
};
</script>
<style scoped lang="scss">
.query-buttons {
  text-align: right;
}
</style>