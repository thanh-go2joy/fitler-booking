<template>
  <el-dialog :visible.sync="ui.dialogFormVisible">
    <p slot="title" style="font-size: 20px;">Hoàn tiền</p>
    <div class="text-break">{{ $t('page.bookingReport.reimburse') }}
      <b>{{ setRefundAmount(form) }}</b>
      {{  $t('page.bookingReport.toGuest') }}
      <b>{{ form.appUserNickName }}</b>
      {{ $t('page.bookingReport.by') }} {{ setPaymentProvider(form.paymentProvider).replace('(', '').replace(')', '') }}
    </div>
    <div class="content">
      <ul>
        <li>
          <el-row type="flex" align="center">
            <el-col :xs="8" :sm="11" :md="10" :lg="8" :xl="6">
              {{ $t('page.bookingReport.room') }}
            </el-col>
            <el-col :xs="16" :sm="13" :md="14" :lg="16" :xl="18">
              {{ form.roomTypeName }}
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row type="flex" align="center">
            <el-col :xs="8" :sm="11" :md="10" :lg="8" :xl="6">
              {{ $t('page.bookingReport.hotel') }}
            </el-col>
            <el-col :xs="16" :sm="13" :md="14" :lg="16" :xl="18">
              {{ form.hotelName }}
            </el-col>
          </el-row>
        </li>

        <li>
          <el-row type="flex" align="center">
            <el-col :xs="8" :sm="12" :md="10" :lg="8" :xl="6">
              {{ $t('page.bookingReport.bookingId') }}
            </el-col>
            <el-col :xs="16" :sm="13" :md="14" :lg="16" :xl="18">
              <router-link
                :to="{ name: 'firstBookingDetails', params: { sn: form.sn}}"
              >
                {{ form.bookingNo }}
              </router-link>
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <el-button @click="ui.dialogFormVisible = false" size="medium">{{ $t('page.bookingReport.cancelAction') }}</el-button>
      <el-button type="primary" @click="onSubmit" size="medium" :loading="ui.isSubmiting">{{ $t('page.bookingReport.refund') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { repStatus } from '@/utils/const'
import { refundUserBooking } from './api'

export default {
  name: 'PopupRefund',
  data () {
    return {
      form: {},
      ui: {
        isSubmiting: false,
        dialogFormVisible: false
      }
    }
  },
  methods: {
    open (data) {
      this.form = data
      this.ui.dialogFormVisible = true
    },
    setRefundAmount (form) {
      return `${this.formatMoney(form.refundingAmount)}đ`
    },
    async onSubmit () {
      this.ui.isSubmiting = true
      try {
        const { data } = await refundUserBooking(this.form.sn)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: `${this.$t('message.refundSuccess')}`
          })
          this.ui.dialogFormVisible = false
          this.$emit('onSuccess')
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSubmiting = false
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
.text-break {
  word-break: break-word;
  margin-bottom: 1vh;
}
.content {
  word-break: break-word;
  padding-left: 1vw;
}
.el-col {
  padding: unset;
}
b {
  font-weight: bold;
}
ul {
  list-style: disc;
  margin-left: 0.5vw;
}
</style>
