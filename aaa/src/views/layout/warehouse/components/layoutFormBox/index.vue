<template>
<div class="layoutFormBox">
  <Form
    ref="formValidateBox"
    :model="modalData"
    :rules="boxRuleValidate"
    :label-width="130"
  >
    <FormItem 
      label="微仓编码"
      prop="stationCode"
    >
      <Input 
        v-model="modalData.stationCode"
        maxlength="10"
        :disabled="true"
      />
    </FormItem>
    <FormItem 
      label="微仓名称"
      prop="stationName"
    >
      <Input 
        v-model="modalData.stationName"
        maxlength="10"
        :disabled="true"
      />
    </FormItem>
    <FormItem 
      label="是否已有布局图"
      prop="existedLayout"
    >
      <Select
        v-model="modalData.existedLayout"
        :disabled="true"
      >
        <Option
          v-for="item in existedLayoutList"
          :value="item.value"
          :key="item.value"
        >{{item.key}}</Option>
      </Select>
    </FormItem>
    <FormItem
      required
      label="是否已使用陈列系统"
      prop="enabledDmsName"
    >
      <Select
        v-model="modalData.enabledDms"
      >
        <Option
          v-for="item in enabledDmsList"
          :value="item.value"
          :key="item.value"
        >{{item.key}}</Option>
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
  name: 'layoutFormBox',
  props: {
    modalData: {
      type: Object,
      require: true
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    enabledDmsList: {
      type: Array,
      required: true
    },
    existedLayoutList: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      boxRuleValidate: {
        // businessMode: [
        //   { required: true, message: "请选择大区" }
        // ]
      },
    }
  },
  methods: {
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
  .layoutFormBox {
    padding: 10px 60px 0 0;
  }
  
</style>