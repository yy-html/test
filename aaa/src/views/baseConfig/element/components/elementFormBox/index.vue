<template>
  <div class="elementFormBox">
    <Form
      ref="formValidateBox"
      :model="modalData"
      :rules="boxRuleValidate"
      :label-width="130"
    >
      <FormItem 
        required
        label="设备归属" 
        prop="businessMode"
      >
        <Select
          v-model="modalData.businessMode"
          clearable
        >
          <Option
            v-for="item in businessModeList"
            :value="item.value"
            :key="item.value"
            >{{ item.key }}</Option
          >
        </Select>
      </FormItem>
      <FormItem 
        required
        label="是否归属区域" 
        prop="equipmentBelong"
      >
        <Select
          v-model="modalData.equipmentBelong"
          clearable
        >
          <Option
            v-for="item in equipmentBelongList"
            :value="item.value"
            :key="item.value"
          >{{item.key}}</Option>
        </Select>
      </FormItem>
      <FormItem 
        :required="!!modalData.equipmentBelong"
        label="区域"
        prop="districtId"
        :rules="!!modalData.equipmentBelong ? [{required: true, message: '请选择区域'}] : []"
      >
        <Select
          v-model="modalData.districtId"
          clearable
          filterable
          remote
          :remote-method="getDistrictList"
          :loading="districtLoading">
          <Option v-for="(item, index) in districtList" :value="item.id" :key="index">{{item.districtCode}}/{{item.districtName}}</Option>
        </Select>
      </FormItem>
      <FormItem 
        required
        label="设备编码" 
        prop="equipmentCode"
      >
        <Input 
          clearable
          v-model="modalData.equipmentCode"
          maxlength="10"
          class="equipmentCode-input"
          @on-keyup="onEquipmentCodeChange"
          @on-blur="onEquipmentCodeChange"
        />
      </FormItem>
      <FormItem 
        required
        label="设备名称" 
        prop="equipmentName"
      >
        <Input 
          v-model="modalData.equipmentName"
          maxlength="10"
          clearable
        />
      </FormItem>
      <FormItem 
        label="设备体积" 
      >
        <Input 
          :disabled="true"
          :value="`${+modalData.length || 'X'}*${+modalData.width || 'Y'}*${+modalData.height || 'Z'}`"
          clearable
        />
      </FormItem>
      <FormItem 
        required
        label="长（mm）"
        prop="length"
      >
        <Input 
          v-model="modalData.length"
          maxlength="5"
          @on-keyup="onNumberChange"
          @on-blur="onNumberChange"
          clearable
        />
      </FormItem>
      <FormItem 
        required
        label="宽（mm）" 
        prop="width"
      >
        <Input 
          v-model="modalData.width"
          maxlength="5"
          @on-keyup="onNumberChange"
          @on-blur="onNumberChange"
          clearable
        />
      </FormItem>
      <FormItem
        required
        label="高（mm）"
        prop="height"
      >
        <Input 
          v-model="modalData.height"
          maxlength="5"
          @on-keyup="onNumberChange"
          @on-blur="onNumberChange"
          clearable
        />
      </FormItem>
      <FormItem
        required
        label="状态"
        prop="equipmentStatus"
      >
        <Select
          v-model="modalData.equipmentStatus"
          clearable
        >
          <Option
            v-for="item in districtStatusList"
            :value="item.value"
            :key="item.value"
            >{{item.key}}</Option
          >
        </Select>
      </FormItem>
      <FormItem  
        required
        label="图标" 
        prop="iconId"
        :error="fileError"
      >
        <Button 
          type="primary" 
          @click="onIconModalOpen"
          style="vertical-align: top;"
        >选择</Button>
        <div 
          class="file-preview"
          v-if="!!modalData.iconId"
        >
          <img :src="modalData.iconUrl" />
          <span 
            @click="removeFile"
            class="remove"
            title="删除"
          >
            <Icon type="md-close" />
          </span>
        </div>
      </FormItem>
      <FormItem>
        <Button @click="handleCancel">
          取消
        </Button>
        <Button type="primary" @click="handleSubmit">
          保存
        </Button>
      </FormItem>
    </Form>
    <Modal
      title="图标库-选择图标"
      :mask-closable="false"
      v-model="modalVisible"
      footer-hide
      style="width:800px;"
      @on-cancel="onIconModalCancel"
    >
      <div 
        class="all-icon-box level-center"
        v-if="modalVisible"
      >
        <div class="icon-search">
          名称：<Input v-model="iconSearchValue" style="width: 200px" />
          <Button type="primary" @click="filterAllIconList">查询</Button>
        </div>
        <div class="icon-container">
          <div class="total">总计：{{iconListFiltration.length}}个</div>
          <RadioGroup
            @on-change="onIconSelectChange"
            :key="filterTrigger"
            class="icon-list"
          >
            <div 
              class="icon-item"
              v-for="(item, index) in iconListFiltration"
              :key="index"
            >
              <Radio 
                :label="`${item.id},${item.iconUrl}`"
              >
                <ItemFileBox 
                  :iconUrl="item.iconUrl"
                  :iconName="item.iconName"
                  imgWidth="80"
                />
              </Radio>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div class="level-center">
        <Button @click="onIconModalCancel">
          取消
        </Button>
        <Button 
          type="primary"
          @click="selectIcon"
          :disabled="!Object.keys(iconSelection).length"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getDistrictList } from '@/apis/baseConfig/'
import { getIconList } from '@/apis/baseConfig/'
import ItemFileBox from '@/views/baseConfig/icon/components/itemFileBox'
export default {
  name: 'FormBox',
  components: {
    ItemFileBox,
  },
  props: {
    modalData: {
      type: Object,
      require: true
    },
    businessModeList: {
      type: Array,
      default: []
    },
    districtStatusList: {
      type: Array,
      default: []
    },
    equipmentBelongList: {
      type: Array,
      default: []
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileError: '',
      modalVisible: false,
      allIconList: [],
      iconSearchValue: '',
      iconSelection: {},
      filterTrigger: '',
      districtList: [],
      districtLoading: false,
      boxRuleValidate: {
        equipmentBelong: [
          { required: true, message: "请选择是否归属区域" }
        ],
        businessMode: [
          { required: true, message: "请选择设备归属" }
        ],
        // districtId: [
        //   { required: true, message: "请选择区域" }
        // ],
        equipmentCode: [
          { required: true, message: "请输入设备编码" }
        ],
        equipmentName: [
          { required: true, message: "请输入设备名称" }
        ],
        length: [
          { required: true, message: "请输入长" }
        ],
        width: [
          { required: true, message: "请输入宽" }
        ],
        height: [
          { required: true, message: "请输入高" }
        ],
        equipmentStatus: [
          { required: true, message: "请选择状态" }
        ],
        iconId: [
          { required: true, message: "请选择图标" }
        ],
      },
    }
  },
  mounted() {
    const { districtCode } = this.modalData
    if (districtCode) {
      this.getDistrictList(districtCode)
    }
  },
  computed: {
    iconListFiltration() {
      const r = this.filterTrigger
      this.setIconSelection({})
      return this.allIconList.filter(item => item.iconName.includes(r))
    },
  },
  methods: {
    getAllIconList() {
      const params = {
        iconStatus: 1,
        pageNum: 1,
        pageSize: 999
      }
      getIconList(params).then(res => {
        if (res.code === 200) {
          this.allIconList = 
            res.result.list
              .filter(item => item.iconStatus == 1)
              .sort((a, b) => a.iconName.localeCompare(b.iconName))
          return
        }
        this.$Message.error(res.message)
      })
    },
    setIconSelection(data) {
      this.iconSelection = {...data}
    },
    onIconSelectChange(value) {
      const [iconId, iconUrl] = value.split(',')
      this.setIconSelection({
        iconId,
        iconUrl
      })
    },
    filterAllIconList() {
      this.filterTrigger = this.iconSearchValue
    },
    onEquipmentCodeChange({ target }) {
      if (target.value.length > 10) {
        target.value = target.value.slice(0, 10)
      }
      target.value = target.value.replace(/[\W]/g, '')
    },
    onNumberChange({ target }) {
      if (target.value.length == 1) {
        target.value = target.value.replace(/[^1-9]/g,'')
      }
      target.value = target.value.replace(/[^\d]/g, '')
    },
    handleSubmit() {
      const validateFile = this.checkFile()

      this.$refs.formValidateBox.validate(valid => {
        if (valid && validateFile) {
          this.$emit('handleSubmit')
        }
      })
    },
    onIconModalOpen() {
      this.modalVisible = true
      this.iconSearchValue = ''
      this.filterAllIconList()
      this.getAllIconList()
    },
    onIconModalCancel() {
      this.modalVisible = false
    },
    selectIcon() {
      this.$emit('mergeModalData', this.iconSelection)
      this.onIconModalCancel()
    },
    handleCancel() {
      this.$refs.formValidateBox.resetFields()
      this.$emit('handleCancel')
    },

    getDistrictList(query) {
      if (query !== '') {
        this.districtLoading = true
        const params = {
          districtStatus: 1,
          districtIdAndName: query
        }
        getDistrictList(params).then(res => {
          if (res.code === 200) {
            this.districtList = res.result
            this.districtLoading = false
          }
        })
      } else {
        this.districtLoading = false
        this.districtList = []
      }
    },

    removeFile() {
      this.$emit('mergeModalData', { iconUrl: '', iconId: '' })
    },

    checkFile() {
      const hasFile = this.modalData.iconId
      if (!hasFile) {
        this.setFileError()
      }
      return hasFile
    },
    setFileError(value) {
      if (value || value == 0) {
        this.fileError = ''
      } else {
        this.fileError = '请选择图标'
      }
    },
  },
  watch: {
    'modalData.iconId'(newValue) {
      this.setFileError(newValue)
    }
  },
}
</script>

<style scoped lang="scss">
.elementFormBox {
  padding: 10px 60px 0 0;
  $imgWidth: 32px;
  /deep/.ivu-form-item-content {
    height: $imgWidth;
  }
  .file-preview {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    img {
      display: block;
      width: $imgWidth;
      height: $imgWidth;
    }
    .remove {
      cursor: pointer;
      position: absolute;
      width: 14px;
      text-align: center;
      line-height: 14px;
      left: $imgWidth;
      top: 0;
    }
  }
  /deep/.equipmentCode-input {
    input {
      text-transform:  uppercase;
    }
  }
}
.all-icon-box {
  .icon-search {
    margin: 10px 0 20px 0;
  }
  .icon-container {
    margin-bottom: 20px;
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
.level-center {
  text-align: center;
}
</style>