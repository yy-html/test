<template>
<div>
  <Select
    v-model.trim="currVal"
    filterable
    clearable
    remote
    :disabled="disabled"
    :ref="refName"
    :placeholder="placeholder"
    :remote-method="executeQuery"
    :label-in-value="true"
    @on-query-change="onOueryChange"
    @on-open-change	="onOpenChange"
    @on-change="onSelect"
    :loading="loading">
    <Option 
      v-for="(option, index) in dataList" 
      :value="option[valName]" 
      :key="index"
      :label="renderFormat(option)">
    </Option>
  </Select>
</div>
  
</template>

<script>
import {debounce} from 'lodash'

export default {
  name: 'FuzzyQuerySelect',
  props: {
    refName:  {
      type: String,
      default: 'FuzzyQuerySelectRef'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 字段名称
    keyName: {
      type: String,
      required: true
    },
    defaultVal: Object,
    // 自定义渲染函数
    renderFormat: {
      type: Function,
      default: item => item.name
    },
    valName:  {
      type: String,
      required: true
    },
    remoteMethod:  {
      type: Function,
      required: true
    },
    // 延迟时间ms
    debounceWait: {
      type: Number,
      default: 300
    },
    extraParams: {
     type: Object,
     default: () => {
       return {}
     }
    },
    queryKey: {
      type: String,
      default: "query"
    },
    // 是否开启 无匹配数据自动加入当前查询条件
    persistQuery: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  created () {
    // 初始化Debounce句柄 保证多次请求使用同一个Debounce
    this.getDataListDebounce = debounce(this.getDataList, this.debounceWait)
  },
  watch: {
    defaultVal: {
      handler:  function (newVal, oldVal) {
        if (newVal) this.setDefaultVal([newVal])
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      query: '',
      loading: false,
      currVal: '',
      dataList: []
    }
  },
  methods: {
    onOueryChange(query) {
      console.log('onOueryChange:', query)
    },
    onOpenChange(flag) {
    },
    onSelect(item) {
      // 记录当前选择的下拉选项 用于回显
      if (item) {
        //原始值
        const originalItem = this.dataList.find(target=>target[this.valName]==item.value)
        this.query = this.renderFormat(originalItem)
        this.$emit('on-change', item, originalItem)
      } else {
        // clear
        this.resetData()
        this.$emit('on-change')
      }
    },
    setDefaultVal(defaultVal) {
      if (Array.isArray(defaultVal) && defaultVal.length==1) {
        this.dataList = defaultVal
        this.currVal = defaultVal[0][this.valName]
      }
    },
    resetData() {
      this.dataList = []
      this.currVal = ''
      this.query = ''
      this.$refs[this.refName].clearSingleSelect()
    },
    executeQuery(query) {
      this.query = query
      return this.getDataListDebounce()
    },
    getDataList() {
      if (this.loading || !this.query || this.dataList.map(item => this.renderFormat(item)).indexOf(this.query)>-1) {
        return
      }
      this.loading = true

      if (this.persistQuery) {
        this.dataList = [{
          [this.keyName]: this.query,
          [this.valName]: this.query
        }]
      } else {
        this.dataList = []
      }
      
      let params = {
        [this.queryKey]: this.query
      }

      if (typeof this.remoteMethod !== 'function') return

      this.remoteMethod.call(null, {...params, ...this.extraParams}).then(res => {
        if (res.code == 200) {
          const list = res.result
          if (Array.isArray(list) && list.length) {
            if(this.persistQuery){
              let flag = list.find(item => item[this.keyName] == this.query)
              if(flag){
                this.dataList = list
              }else{
                this.dataList = this.dataList.concat(list)
              }
            }else{
              this.dataList = list
            }
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
