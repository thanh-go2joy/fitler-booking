<template>
  <el-form
    ref="form"
    class="cancel-form"
    :model="form"
    :rules="rules"
    hide-required-asterisk
  >
  <el-dialog :visible.sync="ui.dialogFormVisible">
    <p slot="title" style="font-size: 20px;">{{ $t('page.bookingReport.cancelReservation') }}</p>
    <div class="text-break">{{ $t('page.bookingReport.cancelReservation') }}
      <b>{{ bookingInfo.roomTypeName }}</b>
      {{ $t('page.bookingReport.at') }}
      <b>{{ bookingInfo.hotelName }}.</b>
      {{ $t('page.bookingReport.bookingIdIs') }}
      <router-link
        :to="{ name: 'firstBookingDetails', params: { sn: bookingInfo.sn}}"
      >
        {{ bookingInfo.bookingNo }}
      </router-link>
    </div>
    <div style="margin-top: 2vh">
      <span style="color: red">*</span> {{ $t('page.bookingReport.cancellationReason') }}
    </div>
    <el-row :gutter="20" v-loading="ui.isLoadingBookingCancelReason">
      <el-form-item
        prop="regionsMgt"
      >
        <el-radio-group v-model="form.reasonCancelSn">
            <el-col v-for="(item, index) in bookingCancelReasonOptions" :key="index" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-radio :label="item.reasonCancelSn">{{ item.reasonCancelText }}</el-radio>
            </el-col>
            <el-col v-if="form.reasonCancelSn === otherReasonCancelSn" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item prop="reasonCancelOther">
                <el-input type="textarea"
                  maxlength="500"
                  show-word-limit
                  rows="5"
                  v-model="form.reasonCancelOther"
                  :placeholder="$t('page.bookingReport.inputReason')">
                </el-input>
              </el-form-item>
            </el-col>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <div slot="footer">
      <el-button @click="ui.dialogFormVisible = false" size="medium">{{ $t('page.bookingReport.cancelAction') }}</el-button>
      <el-button type="primary" @click="preHandleBeforeSubmit" size="medium" :loading="ui.isSubmiting">{{ $t('page.bookingReport.cancelReservation') }}</el-button>
    </div>
  </el-dialog>
  </el-form>
</template>

<script>
import { repStatus } from '@/utils/const'
import { cancelBooking, getBookingCancelReason } from './api'

export default {
  name: 'PopupCancel',
  data () {
    return {
      bookingInfo: {},
      bookingCancelReasonOptions: [],
      form: {
        reasonCancelSn: '',
        reasonCancelOther: ''
      },
      ui: {
        isSubmiting: false,
        dialogFormVisible: false,
        isLoadingBookingCancelReason: false
      },
      rules: {
        reasonCancelOther: [
          { validator: this.validateRequied, trigger: 'blur' }
        ]
      },
      otherReasonCancelSn: ''
    }
  },
  methods: {
    open (data) {
      this.bookingInfo = data
      this.resetForm()
      this.fetchBookingCancelReason()
      this.ui.dialogFormVisible = true
    },
    async fetchBookingCancelReason () {
      this.ui.isLoadingBookingCancelReason = true
      try {
        const { data } = await getBookingCancelReason()
        if (data?.code === repStatus.sussess) {
          this.bookingCancelReasonOptions = data.data
          if (data.data.length > 0) {
            this.otherReasonCancelSn = data.data.slice(-1)[0].reasonCancelSn // Default: lý do khác luôn nằm cuối
          }
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingBookingCancelReason = false
      }
    },
    preHandleBeforeSubmit () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        this.submit()
      })
    },
    async submit () {
      this.ui.isSubmiting = true
      try {
        if (this.form.reasonCancelSn !== this.otherReasonCancelSn) {
          this.form.reasonCancelOther = ''
        } else {
          this.form.reasonCancelOther = this.form.reasonCancelOther.trim()
        }
        const { data } = await cancelBooking(this.bookingInfo.sn, this.form)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: `${this.$t('message.cancelSuccess')}`
          })
          this.ui.dialogFormVisible = false
          this.$emit('onSuccess')
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSubmiting = false
      }
    },
    resetForm () {
      this.form = {
        reasonCancelSn: '',
        reasonCancelOther: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: 32vw;
  @media (max-width: 640px) {
    width: 90vw;
  }
  .el-dialog__header,
  .el-dialog__body {
    text-align: left;
    padding: 16px 20px;
    .el-form-item {
      margin-bottom: unset;
    }
  }
}
a {
  text-decoration: none;
  color: #409eff;
}
.cancel-form {
  margin-top: 2vh;
  .el-radio {
    white-space: pre-wrap;
    word-break: break-word;
  }
}
.text-break {
  word-break: break-word;
}
</style>
