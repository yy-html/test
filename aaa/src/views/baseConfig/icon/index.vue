<template>
  <div class="dms-baseConfig-icon-index">
    <mfb-page-table>
      <div slot="queryForm">
        <Form inline :label-width="110">
          <FormItem 
            label="名称" 
          >
            <Input v-model="vStore.queryParams.iconName" clearable />
          </FormItem>
          <FormItem 
            label="状态" 
          >
            <Select
              v-model="vStore.queryParams.iconStatus"
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
          v-if="hasPermission('iconListAdd')"
          type="primary"
          class="mgl10"
          @click="addIcon"
        >添加</Button>
        <Button
          v-if="hasPermission('iconListAll')"
          type="primary"
          class="mgl10"
          @click="showAllIcon"
        >查看全部</Button>
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
      <IconFormBox 
        v-if="modalVisible && (modalType === 0 || modalType === 1)"
        :modalData="modalData"
        :districtStatusList="districtStatusList"
        :isEditing="!!modalType"
        @handleSubmit="handleModalSubmit"
        @handleCancel="onModalCancel"
        @mergeModalData="mergeModalData"
      />

      <div 
        class="single-icon-box level-center" 
        v-if="modalType === 2"
      >
        <ItemFileBox 
          :iconUrl="modalData.iconUrl"
          :iconName="modalData.iconName"
          imgWidth="150"
        />
        <div>
          <Button type="primary" @click="onModalCancel">关闭</Button>
        </div>
      </div>

      <div
        class="all-icon-box level-center"
        v-if="modalType === 3"
      >
        <div class="icon-search">
          名称：<Input v-model="iconSearchValue" style="width: 200px" />
          <Button type="primary" @click="filterAllIconList">查询</Button>
        </div>
        <div class="icon-container">
          <div 
            class="icon-classify" 
            v-for="(statusText, index) in ['有效状态', '无效状态']" 
            :key="index"
          >
            <div class="sub-title">
              <span class="status">{{statusText}}</span>
              <span class="total">总计：{{iconListClassify[index].length}}个</span>
            </div>
            <ul class="icon-list">
              <li 
                class="icon-item"
                v-for="(item, index) in iconListClassify[index]"
                :key="index"
              >
                <ItemFileBox 
                  :iconUrl="item.iconUrl"
                  :iconName="item.iconName"
                  imgWidth="80"
                />
              </li>
            </ul>
          </div>
        </div>
        <Button type="primary" @click="onModalCancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { listMixin } from "@/mixins/list.mixin"
import { authMixin } from '@/mixins/auth.mixin.js'
import { MfbObjUtil } from "@mfb/pc-utils-micro"
import IconFormBox from './components/iconFormBox'
import ItemFileBox from './components/itemFileBox'
import { getEnum } from '@/apis/common'
import {
  getIconList,
  addIcon,
  editIcon,
} from '@/apis/baseConfig/'

const initFormData = {
  id: null,
  iconName: '',
  iconUrl: '',
  iconStatus: 1,
}

export default {
  name: "dms-baseConfig-icon-index",
  mixins: [listMixin, authMixin],
  components: {
    IconFormBox,
    ItemFileBox,
  },
  data() {
    return {
      getListService: getIconList,
      iconSearchValue: '',
      filterTrigger: '',
      allIconList: [],
      modalVisible: false,
      modalType: 0,
      modalCancelCb: () => {},
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
          title: "名称",
          key: "iconName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "地址",
          key: "iconUrl",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "状态",
          key: "iconStatusName",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "更新时间",
          key: "updateTimeString",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "更新人",
          key: "updateUserName",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "操作",
          align: "center",
          minWidth: 150,
          fixed: 'right',
          render: (h, params) => {
            let arr = [];
            let ids = [
              {
                name: "查看",
                permission: "detail",
                type: "primary",
                method: "showItemIcon"
              },
              {
                name: "修改",
                permission: "iconListEdit",
                type: "primary",
                method: "editIcon"
              }
            ]
            ids.forEach(item => {
              this.hasPermission('iconListEdit') 
                && arr.push(
                  h(
                    "Button",
                    {
                      props: {
                        type: item.type || "primary",
                        size: "small",
                        icon: item.icon
                      },
                      style: {
                        marginRight: "10px"
                      },
                      on: {
                        click: () => {
                          this[item.method](params.row);
                        }
                      }
                    },
                    item.name
                  )
                )
            });

            return h("div", arr);
          }
        }
      ]
    };
  },
  computed: {
    iconListClassify() {
      const r = this.filterTrigger
      const {
        list = []
      } = this.modalData
      return list.reduce((prev, next) => {
        const [validList, invalidList] = prev
        const { iconStatus, iconName } = next
        if (this.filterTrigger && !iconName.includes(r)) {
          return prev
        }
        if (iconStatus == 1) {
          validList.push(next)
        } else if (iconStatus == 0) {
          invalidList.push(next)
        }
        return prev
      }, [[], []])
    },
    modalTitle() {
      return ['添加ICON', '修改ICON', '查看', '查看全部'][this.modalType]
    },
  },
  mounted() {
    this.queryList()
  },
  methods: {
    getAllIconList() {
      const params = {
        pageNum: 1,
        pageSize: 999
      }
      return this.getListService(params).then(res => {
        if (res.code === 200) {
          return res
        }
        this.$Message.error(res.message)
        throw null
      })
    },
    filterAllIconList() {
      this.filterTrigger = this.iconSearchValue
    },
    
    addIcon() {
      this.modalType = 0
      this.setModalData(initFormData)
      this.onModalOpen()
    },
    editIcon(row) {
      this.modalType = 1
      this.setModalData(row)
      this.onModalOpen()
    },
    showItemIcon(row) {
      this.modalType = 2
      this.setModalData(row)
      this.onModalOpen()
    },
    showAllIcon() {
      this.getAllIconList().then((res) => {
        this.modalType = 3
        this.iconSearchValue = ''
        this.filterAllIconList()
        this.setModalData({
          list: res.result.list.sort((a, b) => a.iconName.localeCompare(b.iconName))
        })
        this.onModalOpen()
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
      this.modalCancelCb()
    },

    handleModalSubmit() {
      const fetchChangeList = [addIcon, editIcon][this.modalType]
      const {
        id,
        iconName,
        iconStatus,
        iconUrl,
      } = this.modalData
      const params = {
        id: id || null,
        iconName,
        iconStatus,
        iconUrl,
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
      } else {
        this.districtLoading = false
        this.districtList = []
      }
    }
  },
};
</script>
<style scoped lang="scss">
.dms-baseConfig-icon-index {
  
}
.level-center {
  text-align: center;
}
.single-icon-box {

}
.all-icon-box {
  .icon-search {
    margin: 10px 0 20px 0;
  }
  .icon-container {
    max-height: 400px;
    overflow-y: scroll;
    margin-bottom: 20px;
    .icon-classify {
      .sub-title {
        .status {
          font-weight: bolder;
          font-size: 18px;
          margin-right: 40px;
        }
      }
      .icon-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .icon-item {
          width: 50%;
          list-style-type: none;
        }
      }
    }
  }
}
</style>