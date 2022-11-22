<template>
  <sa-section class="hotel-debt-edit" v-loading="isLoading">
    <el-form :model="form" :rules="rules" ref="form">
      <div class="hotel-debt-edit__form">
        <el-form-item :label="$t('page.hotelDebt.hotel_name')">
          <div class="hotel-debt-edit__row">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item>
                <el-input disabled :placeholder="$t('page.hotelDebt.hotel_name')" :value="form.hotel?.name" type="text"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
      </div>

      <div class="hotel-debt-edit__form">
          <el-form-item :label="$t('page.hotelDebt.period_debt_time_period_debt')">
            <div class="hotel-debt-edit__row">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4">
                <el-form-item>
                  <el-date-picker
                    :disabled="form.finalRecord === 0"
                    class="w-100"
                    v-model="dateRange"
                    type="daterange"
                    popper-class="custom-date-range"
                    range-separator="-"
                    :start-placeholder="$t('page.firstBooking.startDate')"
                    :end-placeholder="$t('page.firstBooking.endDate')"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
                <el-form-item>
                  <el-input disabled :value="formatMoney(form.periodDebt)" type="text"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
      </div>

      <div class="hotel-debt-edit__form">
        <el-form-item :label="$t('page.hotelDebt.other_debt')" required>
          <div class="hotel-debt-edit__row">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item prop="otherDebt">
                <el-input-number
                  class="w-100"
                  v-model="form.otherDebt"
                  :controls="false"
                  @blur="handleChangeOtherDebt(form.otherDebt)"
                  :step="1000"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
      </div>

      <div class="hotel-debt-edit__form">
        <el-form-item :label="$t('page.hotelDebt.pay_amount_pay_date')" required>
          <div class="hotel-debt-edit__row">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item prop="payAmount">
                <el-input-number
                  class="w-100"
                  v-model="form.payAmount"
                  :controls="false"
                  @blur="handleChangePayAmount(form.payAmount)"
                  :step="1000"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
              <el-form-item prop="payDate">
                <el-date-picker
                  class="w-100"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="form.payDate"
                />
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
      </div>

      <div class="hotel-debt-edit__form">
        <el-form-item :label="$t('page.hotelDebt.current_debt_balance')">
          <div class="hotel-debt-edit__row">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item>
                <el-input
                  disabled
                  type="text"
                  :value="formatMoney(form.currentDebt)"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
              <el-form-item>
                <el-input
                  type="text"
                  disabled
                  :value="formatMoney(form.balance)"
                />
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
      </div>

      <div class="hotel-debt-edit__form">
        <el-form-item :label="$t('page.hotelDebt.memo')">
          <el-input type="textarea" rows="5" v-model="form.memo" />
        </el-form-item>
      </div>

      <div class="hotel-debt-edit__button">
        <el-button size="large" @click="onRefeshHotelDebt">
            {{ $t('button.refresh')}}
        </el-button>
        <el-button type="info" size="large" @click="$router.go(-1)">
            {{ $t('button.back')}}
        </el-button>
        <el-button type="success" size="large" @click="preHandleBeforeSubmit">
            {{ $t('button.save')}}
        </el-button>
      </div>
    </el-form>
  </sa-section>
</template>
<script>
import saSection from '@/components/globals/SaSection.vue'
import { getHotetDebt, onEditHotetDebt, onRefeshHotetDebt } from './api'
import { repStatus } from '@/utils/const'

export default {
  name: 'HotelDebtEdit',
  components: {
    saSection
  },
  data () {
    return {
      isLoading: false,
      form: {},
      rules: {
        otherDebt: [
          { required: true, message: this.$t('validation.required'), trigger: 'blur' }
        ],
        payAmount: [
          { required: true, message: this.$t('validation.required'), trigger: 'blur' }
        ],
        payDate: [
          { required: true, message: this.$t('validation.required'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.fetchHotetDebt()
  },
  computed: {
    dateRange: {
      get () {
        return [this.form.startDate, this.form.endDate]
      },
      set (val) {
        this.form.startDate = val[0]
        this.form.endDate = val[1]
      }
    }
  },
  methods: {
    async fetchHotetDebt () {
      this.isLoading = true
      try {
        const { data } = await getHotetDebt(this.$route.params.sn)
        if (data?.code === repStatus.sussess) {
          this.form = data.data
        }
      } catch (error) {
        return false
      } finally {
        this.isLoading = false
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
      try {
        const { data } = await onEditHotetDebt(this.$route.params.sn, this.form)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: `${this.$t('message.success')}`
          })
          this.$router.push({
            name: 'hotelDebtDetailList',
            params: {
              sn: this.form.hotelSn
            }
          })
        }
      } catch (error) {
        return false
      }
    },
    async onRefeshHotelDebt () {
      try {
        const query = {
          hotelSn: this.form.hotelSn,
          startDate: this.form.startDate,
          endDate: this.form.endDate
        }
        const { data } = await onRefeshHotetDebt(query)
        if (data?.code === repStatus.sussess) {
          this.form.periodDebt = data.data.periodDebt
          this.form.balance =
            this.form.currentDebt +
            this.form.periodDebt +
            this.form.otherDebt -
            this.form.payAmount
          this.$message({
            type: 'success',
            message: `${this.$t('message.success')}`
          })
        }
      } catch (error) {
        return false
      }
    },
    handleChangeOtherDebt (currentValue) {
      this.form.otherDebt = this.formatEvenPrice(currentValue)
      if (this.form.otherDebt > 0) {
        this.form.balance =
        this.form.periodDebt +
        this.form.otherDebt +
        this.form.currentDebt -
        this.form.payAmount
      }
    },
    handleChangePayAmount (currentValue) {
      this.form.payAmount = this.formatEvenPrice(currentValue)
      if (this.form.payAmount > 0) {
        this.form.balance =
        this.form.periodDebt +
        this.form.otherDebt +
        this.form.currentDebt -
        this.form.payAmount
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-debt-edit {
  :deep(.hotel-debt-edit__form) {
    .el-form-item {
      display: grid;
      grid-template-columns: 1fr;
      margin-bottom: 1em;
      @media (min-width: 640px) {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.75em;
      }
    }
    .el-form-item__label {
      text-align: left;
      @media (min-width: 640px) {
        flex: 1;
      }
    }
    .el-form-item__content {
      @media (min-width: 640px) {
        flex: 3;
      }
    }
  }
  &__row {
    @media (min-width: 640px) {
      display: flex;
      align-items: center;
      gap: 0 2em;
      flex-wrap: wrap;
    }
    &--margin {
      margin: 1em 0;
      @media (min-width: 640px) {
        margin: unset;
      }
    }
  }
  &__button {
    display: flex;;
    justify-content: flex-end;
    margin-top: 2em;
  }
}
.el-col {
  padding: unset;
}
.w-100 {
  width: 100% !important;
}
</style>
