<template>
<div class="areaFormBox">
  <Form
    ref="formValidateBox"
    :model="modalData"
    :rules="boxRuleValidate"
    :label-width="130"
  >
    <FormItem 
      required
      label="区域归属" 
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
          >{{item.key}}</Option
        >
      </Select>
    </FormItem>
    <FormItem 
      required
      label="区域编码"
      prop="districtCode"
    >
      <!-- <Select
        v-model="modalData.districtCode"
        filterable
        remote
        :remote-method="getDistrictCodeList"
        :loading="districtCodeLoading">
        <Option v-for="(item, index) in districtCodeList" :value="item.value" :key="index">{{item.key}}</Option>
      </Select> -->
      <Input 
        clearable
        v-model="modalData.districtCode"
        :disabled="isEditing"
        maxlength="10"
        class="districtCode-input"
        @on-keyup="onDistrictCodeChange"
        @on-blur="onDistrictCodeChange"
      />
    </FormItem>
    <FormItem 
      required
      label="区域名称"
      prop="districtName"
    >
      <!-- <Select
        v-model="modalData.districtName"
        filterable
        remote
        :remote-method="getDistrictNameList"
        :loading="districtNameLoading">
        <Option v-for="(item, index) in districtNameList" :value="item.value" :key="index">{{item.key}}</Option>
      </Select> -->
      <Input 
        v-model="modalData.districtName"
        maxlength="10"
        clearable
        @on-keyup="onDistrictNameChange"
        @on-blur="onDistrictNameChange"
      />
    </FormItem>
    <FormItem 
      required
      label="颜色"
      prop="color"
    >
      <ColorPicker 
        v-model="modalData.color"
        recommend
        style="width: 270px;"
      />
    </FormItem>
    <FormItem
      required
      label="状态"
      prop="districtStatus"
    >
      <Select
        v-model="modalData.districtStatus"
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
    <FormItem>
      <Button @click="handleCancel">
        取消
      </Button>
      <Button type="primary" @click="handleSubmit">
        保存
      </Button>
    </FormItem>
  </Form>
  </div>
</template>

<script>
export default {
  name: 'areaFormBox',
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
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      boxRuleValidate: {
        businessMode: [
          { required: true, message: '请选择区域归属' }
        ],
        districtCode: [
          { required: true, message: '请输入区域编码' }
        ],
        districtName: [
          { required: true, message: '请输入区域名称' }
        ],
        color: [  
          { required: true, message: '请选择颜色' }
        ],
        districtStatus: [
          { required: true, message: '请选择状态' }
        ],
      },
    }
  },
  methods: {
    onDistrictCodeChange({ target, target: { value } }) {
      if (value.length > 10) {
        value = value.slice(0, 10)
      }
      value = value.replace(/[\W]/g, '')
      target.value = value
      // 解决input value输入中文与v-model绑定不同步的问题
      this.$emit('mergeModalData', { districtCode: target.value })
    },
    onDistrictNameChange({ target, target: { value } }) {
      if (value > 10) {
        target.value = value.slice(0, 10)
      }
    },
    handleSubmit() {
      this.$refs.formValidateBox.validate(valid => {
        if (valid) {
          this.$emit('handleSubmit')
        }
      });
    },
    handleCancel() {
      this.$refs.formValidateBox.resetFields()
      this.$emit('handleCancel')
    },
  }
}
</script>

<style scoped lang="scss">
  .areaFormBox {
    padding: 10px 60px 0 0;
    /deep/.ivu-color-picker-rel {
      width: 58px;
    }
    /deep/.districtCode-input {
      input {
        text-transform:uppercase;
      }
    }
  }
  
</style>