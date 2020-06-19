<template>
<div class="iconFormBox">
  <Form
    ref="formValidateBox"
    :model="modalData"
    :rules="boxRuleValidate"
    :label-width="130"
  >
    <FormItem 
      required
      label="图片" 
      :error="fileError"
    >
      <Upload 
        action="/"
        accept="image/png"
        :show-upload-lis="false"
        :before-upload="beforeUpload"
      >
        <Button icon="ios-cloud-upload-outline" type="primary">上传</Button>
      </Upload>
      <div 
        class="file-preview"
        v-if="!!modalData.iconUrl"
      >
        <img :src="modalData.iconUrl" />
        <span 
          class="remove" 
          @click="removeFile"
          title="删除"
        >
          <Icon type="md-close" />
        </span>
        <a 
          class="link"
          :href="modalData.iconUrl"
          target="_blank"
        >
          {{modalData.iconUrl}}
        </a>
      </div>
    </FormItem>
    <FormItem 
      required
      label="名称" 
      prop="iconName"
    >
      <Input 
        v-model="modalData.iconName"
        maxlength="10"
        clearable
      />
    </FormItem>
    <FormItem
      required
      label="状态"
      prop="iconStatus"
    >
      <Select
        v-model="modalData.iconStatus"
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
import {uploadFile} from '@/apis/baseConfig/'
export default {
  name: 'FormBox',
  props: {
    modalData: {
      type: Object,
      require: true
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
      fileError: '',
      imgOptions: {
        fileSize: 2000,
        // width: 100,
        // height: 100,
      },
      boxRuleValidate: {
        iconName: [
          { required: true, message: "请输入名称" }
        ],
        iconStatus: [
          { required: true, message: "请选择状态" }
        ],
      },
    }
  },
  watch: {
    'modalData.iconUrl'(newValue) {
      this.setFileError(newValue)
    }
  },
  methods: {
    handleSubmit() {
      const validateFile = this.checkFile()

      this.$refs.formValidateBox.validate(valid => {
        if (valid && validateFile) {
          this.$emit('handleSubmit')
        }
      })
    },
    handleCancel() {
      this.checkFile()
      this.$refs.formValidateBox.resetFields()
      this.$emit('handleCancel')
    },
    setFileError(value) {
      if (value) {
        this.fileError = ''
      } else {
        this.fileError = '请选择图片'
      }
    },

    beforeUpload(file) {
      const {
        fileSize,
        // width,
        // height
      } = this.imgOptions

      const validateSize = this.checkFileSize(file, fileSize)
      // const validateWidth = await this.checkWidth(file, width)
      // const validateHeight = await this.checkHeight(file, width)

      // if (!validateSize || !validateWidth || !validateHeight) {
      //   throw null
      // }
      this.toUploadFile(file)
      return false
    },
    toUploadFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData)
        .then(res => {
          if (res.code === 200) {
            this.$emit('mergeModalData', { iconUrl: res.result })
            return
          }
          this.$Message.error(res.message)
        })
    },
    removeFile() {
      this.$emit('mergeModalData', { iconUrl: '' })
    },
    checkFile() {
      const hasFile = this.modalData.iconUrl
      if (!hasFile) {
        this.setFileError()
      }
      return hasFile
    },
    checkFileSize(file, fileSize) {
      const isOutOfLimit = file.size / 1024 > fileSize
      if (isOutOfLimit) {
        this.$Message.error(`上传图片大小不能超过${fileSize}k`)
      }
      return !isOutOfLimit
    },
    // async checkWidth(file, imageWidth, imageHeight) {
    //   const { width, height } = await this.getAspectRatio(file)
    //   if (imageWidth !== width) {
    //     this.$Message.error(`上传图片的宽度应为${imageWidth}`)
    //   }
    //   return imageWidth === width
    // },
    // async checkHeight(file, imageHeight) {
    //   const { height } = await this.getAspectRatio(file)
    //   if (imageHeight !== height) {
    //     this.$Message.error(`上传图片的高度应为${imageHeight}`)
    //   }
    //   return imageHeight === height
    // },
    // getAspectRatio(file) {
    //   return new Promise((resolve, reject) => {
    //     const fileReader = new FileReader()
    //     fileReader.readAsDataURL(file);
    //     fileReader.onload = function () {
    //       const image = new Image()
    //       image.src = this.result
    //       image.onload = function () {
    //         resolve({
    //           width: image.width,
    //           height: image.height,
    //           ratio: image.width / image.height
    //         })
    //       }
    //       image.onerror = reject
    //     };
    //     fileReader.onerror = reject
    //   });
    // }
  }
}
</script>

<style scoped lang="scss">
  .iconFormBox {
    padding: 10px 60px 0 0;
    $imgWidth: 50px;
    .file-preview {
      position: relative;
      display: inline-block;
      img {
        width: $imgWidth;
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
      .link {
        display: block;
      }
    }
  }
  
</style>