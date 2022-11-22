<template>
  <sa-section class="hotel-debt">
    <el-form :model="form" :rules="rules" ref="form">
      <div class="hotel-debt__row">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item :label="$t('page.hotelDebt.period_debt_time')" prop="startDate">
              <el-date-picker
                class="w-100"
                v-model="dateRange"
                type="daterange"
                popper-class="custom-date-range"
                range-separator="-"
                :start-placeholder="$t('page.bookingReport.dateFrom')"
                :end-placeholder="$t('page.bookingReport.dateTo')"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item :label="page === 'debt' ? $t('breadcrumb.ApplyForHotel') : $t('page.hotelDebt.pay_amount_pay_date')">
              <p v-if="page === 'debt'">
                {{ ApplyType }}
                <el-link :underline="false" type="primary" @click="onGoToApplyHotel">{{ $t('breadcrumb.ApplyForHotel') }}</el-link>
              </p>
              <upload-file
                v-else
                accept=".xlsx, .xls, .csv"
                @change="handleExceed"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="hotel-debt__button">
        <el-button type="info" size="large" @click="$router.go(-1)">
            {{ $t('button.back')}}
        </el-button>
        <el-button type="success" :loading="ui.isSubmiting" size="large" @click="preHandleBeforeSubmit">
            {{ $t('button.save')}}
        </el-button>
      </div>
    </el-form>
  </sa-section>
</template>
<script>
import saSection from '@/components/globals/SaSection.vue'
import { getHotelApplyPath, onCreateHotelDebt } from './api'
import UploadFile from '@/components/globals/UploadFile'

export default {
  name: 'CreateHotelDebtDetail',
  components: {
    saSection,
    UploadFile
  },
  props: {
    page: {
      type: String,
      default: 'createHotelDebt'
    }
  },
  data () {
    return {
      hotelDebts: {},
      ui: {
        isCallAPI: false,
        isSubmiting: false
      },
      form: {
        startDate: '',
        endDate: '',
        file: ''
      },
      rules: {
        startDate: [
          { required: true, message: this.$t('validation.required'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ApplyType () {
      let applyType
      switch (localStorage.getItem('ApplyType')) {
        case '1':
          applyType = this.$t('page.hotelDebt.apply_all_hotel')
          break
        case '2':
          applyType = this.$t('page.hotelDebt.apply_all_hotel_except')
          break
        case '3':
          applyType = this.$t('page.hotelDebt.only_apply')
          break
        default:
          applyType = this.$t('page.hotelDebt.apply_all_hotel')
          break
      }
      return applyType
    },
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
    async onGoToApplyHotel () {
      try {
        this.ui.isCallAPI = true
        const { data } = await getHotelApplyPath()
        if (data.data.additionalData) {
          this.$router.push({
            name: 'ApplyForHotel',
            query: {
              applyTarget: data.data.additionalData.applyTarget,
              provinceSn: data.data.additionalData.provinceSn,
              districtSn: data.data.additionalData.districtSn,
              keyword: data.data && data.data.additionalData.keyword ? data.data.additionalData.keyword : '',
              page: 'create-hotel-debt',
              typeHotelDebt: this.page
            }
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isCallAPI = false
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
        const formData = Object.keys(this.form).reduce((formData, key) => {
          formData.append(key, this.form[key])
          return formData
        }, new FormData())

        const { data } = await onCreateHotelDebt(this.page, formData)
        if (data.code === 1) {
          localStorage.setItem('create_success', '1')
          localStorage.setItem('ApplyType', '1')
          this.$router.push({
            name: 'hotelDebtReview',
            query: {
              array_hotel: data.data.hotelSnList
            }
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSubmiting = false
      }
    },
    handleExceed (file) {
      this.form.file = file
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-debt {
  &__row {
    :deep(.el-form-item) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 12px;
      @media (max-width: 768px) {
        display: block;
      }
    }
    :deep(.el-form-item__label) {
      text-align: left;
      flex: 1;
    }
    :deep(.el-form-item__content) {
      flex: 4;
    }
    :deep(.el-form-item__error) {
      position: unset;
    }
  }
  &__button {
    display: flex;;
    justify-content: flex-end;
    margin-top: 2em;
  }
  :deep(.el-range-separator) {
    width: 12%;
  }
}
</style>
