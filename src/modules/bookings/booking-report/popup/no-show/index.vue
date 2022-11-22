<template>

  <el-form
    ref="form"
    class="cancel-form"
    :model="form"
    :rules="rules"
    hide-required-asterisk
  >
    <el-dialog :visible.sync="ui.dialogFormVisible">
      <p slot="title" style="font-size: 20px;">{{ $t('page.bookingReport.noShow') }}</p>
      <div class="content">
        <ul>
          <li>
            <el-row type="flex" align="center">
              <el-col :xs="8" :sm="11" :md="10" :lg="8" :xl="6">
                {{ $t('page.bookingReport.room') }}
              </el-col>
              <el-col :xs="16" :sm="13" :md="14" :lg="16" :xl="18">
                {{ bookingInfo.roomTypeName }}
              </el-col>
            </el-row>
          </li>

          <li>
            <el-row type="flex" align="center">
              <el-col :xs="8" :sm="11" :md="10" :lg="8" :xl="6">
                {{ $t('page.bookingReport.hotel') }}
              </el-col>
              <el-col :xs="16" :sm="13" :md="14" :lg="16" :xl="18">
                {{ bookingInfo.hotelName }}
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
                  :to="{ name: 'firstBookingDetails', params: { sn: bookingInfo.sn}}"
                >
                  {{ bookingInfo.bookingNo }}
                </router-link>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item :label="$t('page.bookingReport.reason')" prop="reasonForNoShow">
            <el-input type="textarea"
              maxlength="500"
              show-word-limit
              rows="5"
              v-model="form.reasonForNoShow"
              :placeholder="$t('page.bookingReport.inputReason')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div slot="footer">
        <el-button @click="ui.dialogFormVisible = false" size="medium">{{ $t('page.bookingReport.cancelAction') }}</el-button>
        <el-button type="primary" @click="preHandleBeforeSubmit" size="medium" :loading="ui.isSubmiting">{{ $t('page.bookingReport.noShow') }}</el-button>
      </div>
    </el-dialog>
</el-form>
</template>

<script>
import { repStatus } from '@/utils/const'
import { confirmNoShowBooking } from './api'

export default {
  name: 'PopupNoshow',
  data () {
    return {
      bookingInfo: {},
      form: {
        reasonForNoShow: ''
      },
      ui: {
        isSubmiting: false,
        dialogFormVisible: false
      },
      rules: {
        reasonForNoShow: [
          { validator: this.validateRequied, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open (data) {
      this.bookingInfo = data
      this.resetForm()
      this.ui.dialogFormVisible = true
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
        this.form.reasonForNoShow = this.form.reasonForNoShow.trim()
        const { data } = await confirmNoShowBooking(this.bookingInfo.sn, this.form)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: `${this.$t('message.noshowSuccess')}`
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
        reasonForNoShow: ''
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
ul {
  list-style: disc;
  margin-left: 0.5vw;
}
a {
  text-decoration: none;
  color: #409eff;
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
</style>
