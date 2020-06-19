// 列表页面Mixin

import { MfbObjUtil } from '@mfb/pc-utils-micro'
import * as moment from 'moment'
import {authMixin} from '@/mixins/auth.mixin'

// import { MfbMixins } from "@mfb/pc-components-micro"

export const listMixin = {

  data () {
    return {
      // 查询参数是否改变标志
      isQueryParamsChange: false,
      // 表格参数对象
      tableOptions: {
        loading: false
      },
      // 表格上方操作按钮
      actions: [],
      colSpan: 6,
      loadingText: '',
      // 表格数据源
      listData: {
        list: [],
        total: 0
      },
      // 表格选中记录列表
      selectionData: [],

      // 页面切换回来需要保存的数据放到vStore中
      vStore: {
        // 分页参数对象
        pageOptions: {
          pageNum: 1,
          pageSize: 10
        },
        // 列表查询对象
        queryParams: {}
      }

    }
  },
  mixins: [authMixin],
  computed: {
    // 表格操作列表
    tableActions () {
      return this.actions.filter(item => this.actionListPaths.indexOf(item.path) > -1)
    },
  },

  watch: {
    // 判断查询条件是否有变化
    'vStore.queryParams': {
      handler: function(newVal, oldVal) {
        this.isQueryParamsChange = true
      },
      deep: true
    },
  },

  components: {

  },
  created() {
  },
  methods: {
    // 格式化查询参数
    formatParams (callback) {
      // 清除查询对象中的空值
      let queryParams = MfbObjUtil.removeNull(this.vStore.queryParams)
      // 格式化日期类型
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] instanceof Date && this.queryDateFormat) {
          queryParams[key] = moment(queryParams[key]).format(this.queryDateFormat)
        }
      })
      if (typeof callback === 'function') {
        callback(queryParams)
      }
      return queryParams
    },
    queryList () {
      if (typeof this.getListService !== 'function') {
        this.$Message.error('缺少查询列表的api接口')
        return
      }
      if (this.tableOptions.loading) return
      
      // 检测参数合法性
      if (typeof this.checkParamsValidation === 'function') {
        if (!this.checkParamsValidation()) {
          return
        }
      }
      
      // 如果查询条件变了 重置为第一页
      if (this.isQueryParamsChange) {
        this.$set(this.vStore.pageOptions, 'pageNum', 1)
        this.isQueryParamsChange = false
      }

      let queryParams = this.formatParams()
      // 自定义格式化参数
      if (typeof this.customFormatParams === 'function') {
        this.customFormatParams(queryParams)
      }
      
      // 添加分页信息
      queryParams = Object.assign(queryParams, this.vStore.pageOptions)

      this.$set(this.tableOptions, 'loading', true)
      this.listData.list = []
      this.getListService.call(this, queryParams).then(res => {
        if (res.code == 200) {
          const {list, totalCount, total} = res.result
          this.listData.list = list
          this.listData.total = totalCount || total || 0
        } else {
          this.$message.error(res.message)
        }
        this.$set(this.tableOptions, 'loading', false)
      }).catch(() => {
        this.listData.list = []
        this.listData.total = 0
        this.$set(this.tableOptions, 'loading', false)
      })
    },

    // 生成操作按钮
    generateOptBtn (h, params, type, text, handler, props={}) {
      const self = this
      return h('Button', {
        props: {
          ...props,
          type,
          ghost: type === 'error',
          size: 'small'
        },
        style: {
          'margin': '3px',
          'min-width': 'auto'
        },
        on: {
          click: handler.bind(self, params)
        }
      }, text)
    },

    // pageSize change
    onPageSizeChange (size) {
      this.isQueryParamsChange = false
      // 重置页码为1
      this.$set(this.vStore.pageOptions, 'pageNum', 1)
      this.$set(this.vStore.pageOptions, 'pageSize', size)
      this.queryList()
    },

    // page change
    onPageChange (page) {
      this.isQueryParamsChange = false
      this.$set(this.vStore.pageOptions, 'pageNum', page)
      this.queryList()
    },

    // 表格数据多选
    onSelectionChange (selection) {
      this.selectionData = selection
    },

    resetSelectionChange () {
      this.selectionData = []
    },

    // 清空查询条件
    resetQueryParams () {
      this.vStore.queryParams = {}
    }

  }
}