<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :width="`${width + 40}px`"
    @close="closeDialog"
    class="thumbnail-dialog"
  >
    <div class="thumbnail-dialog__body">
      <clipper-fixed
        ref="clipper"
        :src="imageSrc"
        :style="basicStyle"
        shadow="rgba(0, 0, 0, 0.4)"
        :ratio="propsRatio.width ? propsRatio.width/propsRatio.height : width/height"
        bg-color="transparent"
      >
        <div slot="placeholder">No image</div>
      </clipper-fixed>
    </div>
    <span slot="footer" class="thumbnail-dialog__footer">
      <el-button
        @click="closeDialog"
      >
        {{ $t('button.cancel') }}
      </el-button>
      <el-button
        type="primary"
        @click="updateThumbnailPath"
      >
        {{ $t('button.confirm') }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import VueRx from 'vue-rx'
import 'vuejs-clipper/dist/vuejs-clipper.css'
import { clipperFixed } from 'vuejs-clipper'
Vue.use(VueRx)
export default {
  name: 'ThumbnailDialog',
  components: {
    clipperFixed
  },
  data: () => {
    return {
      file: null,
      imageSrc: '',
      article: {},
      result: ''
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 200
    },
    height: {
      type: [String, Number],
      default: 200
    },
    propsRatio: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (newValue) {
        this.$emit('update:visible', newValue)
      }
    },
    basicStyle: function () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }

  },
  methods: {
    setup (data) {
      this.article = data.article
      this.file = data.file
      // this.imageSrc = URL.createObjectURL(data.file.dataUrl)
      this.imageSrc = data.file.dataUrl
    },
    closeDialog (e) {
      this.$emit('close', e)
    },
    async updateThumbnailPath () {
      try {
        const canvas = this.$refs.clipper.clip()
        const vm = this
        // canvas.toBlob(async function (blob) {
        //   // vm.result = new File([blob], `${vm.file.name}`)
        //   vm.result = new File([blob], `${vm.file?.info?.name}`)
        //   vm.$emit('result', vm.result)
        // })
        canvas.toBlob(async function (blob) {
          // vm.result = new File([blob], `${vm.file.name}`)
          vm.result = new File([blob], `${vm.file?.info?.name}.webp`, { type: blob.type })
          vm.$emit('result', vm.result)
        }, 'image/webp')
      } catch (error) {
        return false
      } finally {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.thumbnail-dialog {
  &__body {
    border-radius: 6px;
    box-sizing: border-box;
    width: 100%;
    line-height: 146px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    :deep(.el-icon-error) {
      font-size: 16px;
      margin-right: 4px;
      color: #F56C6C;
    }
    &--none {
      display: flex;
      align-items: center;
    }
  }
}
</style>
