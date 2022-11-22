<template>
  <sa-section v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.hotel_name') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p v-if="data.hotel"> {{ data.hotel.name }} </p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.period_debt_time') }} / {{ $t('page.hotelDebt.period_debt') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p>{{ formatDateUI(data.startDate, false) }} ~ {{ formatDateUI(data.endDate, false) }} / <strong>{{ formatMoneyUI(data.periodDebt) }}</strong> </p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.other_debt') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p>{{ formatMoneyUI(data.otherDebt) }}</p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.pay_amount') }} / {{ $t('page.hotelDebt.pay_date') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p>
          <strong>{{ formatMoneyUI(data.payAmount) }}</strong> /
          {{ formatDateUI(data.payDate, false) }}
        </p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.current_debt') }} / {{ $t('page.hotelDebt.balance') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p> {{ formatMoneyUI(data.currentDebt) }} / {{ formatMoneyUI(data.balance) }} </p>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <b>{{ $t('page.hotelDebt.memo') }}</b>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <p> {{ data.memo }} </p>
      </el-col>
    </el-row>

    <div class="hote-debt-detail__footer">
      <el-button type="info" size="large" @click="$router.go(-1)">
        {{ $t('button.back') }}
      </el-button>
    </div>
  </sa-section>
</template>
<script>
import saSection from '@/components/globals/SaSection.vue'
import { getHotetDebt } from './api'
import { repStatus } from '@/utils/const'

export default {
  name: 'HotelDebtDetail',
  components: {
    saSection
  },
  data () {
    return {
      data: [],
      isLoading: false
    }
  },
  created () {
    this.listHotetDebt()
  },
  methods: {
    async listHotetDebt () {
      this.isLoading = true
      try {
        const { data } = await getHotetDebt(this.$route.params.sn)
        if (data?.code === repStatus.sussess) {
          this.data = data.data
        }
      } catch (error) {
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-row) {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.hote-debt-detail__footer {
  display: flex;;
  justify-content: flex-end;
  margin-top: 2em;
  @media (max-width: 640px) {
    position: fixed;
    bottom: 0;
    right: 0;
    background: white;
    width: 100%;
    padding-bottom: 1em;
    padding-right: 1em;

    button {
      margin-top: 1em;
    }
  }
}
</style>
