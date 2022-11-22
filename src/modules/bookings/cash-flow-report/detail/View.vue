<template>
  <sa-section>
    <template slot="header">
      <div class="cash-flow-detail__filter" :class="ui.isTableLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="6" :md="5" :lg="5" :xl="3">
            <el-select
              class="w-100"
              v-model="filter.deviceType"
            >
              <el-option
                v-for="(item, index) in ui.deviceTypeOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="7" :lg="6" :xl="4">
            <el-select
              class="w-100"
              v-model="filter.hotelSn"
              :loading="ui.isLoadingHotel"
              :placeholder="$t('page.bookingReport.hotelName')"
              remote
              filterable
              :remote-method="searchSuggestionsHotels"
              prefix-icon="el-icon-search"
              clearable
            >
              <el-option
                v-for="(item, index) in hotels"
                :key="index"
                :label="item.name"
                :value="item.sn"
                style="font-size: 13px; color: #4a5d6e;"
              >
                <div class="cash-flow-detail__filter--text-line cash-flow-detail__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="cash-flow-detail__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="6">
            <el-date-picker
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
          </el-col>
          <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="2">
            <el-button
              class="w-100"
              type="primary"
              plain
              @click="changeFilter"
            >
              {{ $t('button.search') }}
            </el-button>
          </el-col>
        </el-row>

        <el-row class="flex-center">
          <el-col :xs="24" :sm="6" :md="4" :lg="4" :xl="3">
            <b>{{ $t('page.cashFlowReport.paidInAdvance') }}</b>
          </el-col>
          <el-col :xs="24" :sm="10" :md="6" :lg="6" :xl="3">
            <el-input type="text" disabled="disabled" :value="formatMoney(headerContent.prepayAmount)"></el-input>
          </el-col>
        </el-row>
        <el-row class="flex-center">
          <el-col :xs="24" :sm="6" :md="4" :lg="4" :xl="3">
            <b>{{ $t('page.cashFlowReport.balance') }}</b>
          </el-col>
          <el-col :xs="24" :sm="10" :md="6" :lg="6" :xl="3">
            <el-input type="text" disabled="disabled" :value="formatMoney(headerContent.hotelRefund)"></el-input>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table ref="cashflowReportDetail" :data="data" v-loading="ui.isTableLoading" max-height="580px">
      <el-table-column label="#" type="index" :index="indexMethod"/>
      <el-table-column :min-width="105"
        :label="$t('page.cashFlowReport.deviceType')"
      >
        <template slot-scope="scope">
          <p>{{ getDeviceType(scope.row.deviceType) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.cashFlowReport.bookingTime')"
      >
        <template slot-scope="scope">
          <p>{{ formatDateUI(scope.row.createTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.cashFlowReport.bookingInfo')"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.bookingNo }}</p>
          <p>{{ scope.row.mobile}}</p>
          <router-link :to="{name: 'detailRoomType', params: { sn: scope.row.roomTypeSn }}">
            {{ scope.row.roomTypeName}}
          </router-link>
          <p>
            {{ getBookingType(scope.row.type)}}
            {{ scope.row.checkInDatePlan ? `: ${formatDateUI(scope.row.checkInDatePlan, false)}` : '' }}
            <span v-if="scope.row.type === 3">{{ scope.row.endDate }}</span>
          </p>
          <p v-if="scope.row.type === 1">
            {{ formatTime(scope.row.startTime) }} ~ {{ formatTime(scope.row.endTime) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.cashFlowReport.coupon')"
      >
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="onDirectCoupon(scope.row)">
            {{ scope.row.couponName}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
            <p> {{ this.$t('page.cashFlowReport.totalAmount') }} </p>
            <p class="blue-color"> {{ this.$t('page.cashFlowReport.roomAmount') }} </p>
            <p class="purple-color"> {{ this.$t('page.cashFlowReport.extraFee') }} </p>
            <p class="green-color"> {{ this.$t('page.cashFlowReport.productAmount') }} </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.totalAmount) }}</p>
          <p class="blue-color">{{ formatMoney(scope.row.roomTypeAmount) }}</p>
          <p class="purple-color">{{ formatMoney(scope.row.extraFee) }}</p>
          <p class="green-color">{{ formatMoney(scope.row.productValue) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
            <p> {{ this.$t('page.cashFlowReport.g2jDiscount') }} </p>
            <p class="blue-color"> {{ this.$t('page.cashFlowReport.coupon') }} </p>
            <p class="purple-color"> {{ this.$t('page.cashFlowReport.mileagePoint') }} </p>
            <p class="green-color"> {{ this.$t('page.cashFlowReport.otherDiscount') }} </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.totalGo2joyDiscount) }}</p>
          <p class="blue-color">{{ formatMoney(scope.row.go2joyDiscount) }}</p>
          <p class="purple-color">{{ formatMoney(scope.row.mileagePoint) }}</p>
          <p class="green-color">{{ formatMoney(scope.row.promotionDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
          <p> {{ this.$t('page.cashFlowReport.hotelDiscount') }} </p>
          <p> {{ this.$t('page.cashFlowReport.coupon') }} </p>
          <p> {{ this.$t('page.cashFlowReport.flashSale') }} </p>
          <p> {{ this.$t('page.cashFlowReport.redeemStamp') }} </p>
          <p> {{ this.$t('page.cashFlowReport.directDiscount') }} </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.totalHotelDiscount) }}</p>
          <p>{{ formatMoney(scope.row.hotelDiscount) }}</p>
          <p>{{ formatMoney(scope.row.fsHotelDiscount) }}</p>
          <p>{{ formatMoney(scope.row.redeemValue) }}</p>
          <p>{{ formatMoney(scope.row.directDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.cashFlowReport.userPay')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.amountFromUser) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="120"
        :label="$t('page.cashFlowReport.commission')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.totalCommissionAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
          <p> {{ this.$t('page.cashFlowReport.balance') }} </p>
          <p> {{ this.$t('page.cashFlowReport.receivable') }} </p>
          <p> {{ this.$t('page.cashFlowReport.payable') }} </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.hotelRefund) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.cashFlowReport.paidInAdvance')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoney(scope.row.prepayAmount) }}</p>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.perPage"
        :current-page="pagination.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      />
    </template>
  </sa-section>
</template>
<script>
import saSection from '@/components/globals/SaSection.vue'
import { getCashFlow } from './api'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { debounce, scrollToTop } from '@/utils/helpers'
import { repStatus, DEVICE_TYPE_OPTIONS } from '@/utils/const'

const timeDebounce = 500
export default {
  name: 'CashFlowReportDetail',
  components: {
    saSection
  },
  data () {
    return {
      filter: {
        limit: 10,
        page: 1,
        startDate: this.$route.params.startDate,
        endDate: this.$route.params.endDate,
        deviceType: Number(this.$route.params.deviceType),
        hotelSn: null
      },
      pagination: {},
      ui: {
        isTableLoading: false,
        isLoadingHotel: false,
        hotel: {},
        deviceTypeOptions: DEVICE_TYPE_OPTIONS
      },
      hotels: [],
      data: [],
      headerContent: {}
    }
  },
  computed: {
    dateRange: {
      get () {
        return [this.filter.startDate, this.filter.endDate]
      },
      set (val) {
        this.filter.startDate = val[0]
        this.filter.endDate = val[1]
      }
    }
  },
  created () {
    this.filter.hotelSn = Number(this.$route.params.sn) || null
    const params = { limit: 10, justHotel: 1, hotelSn: this.filter.hotelSn }
    this.fetchSuggestionsHotels(params)
    this.changeFilter()
  },
  methods: {
    changeFilter () {
      this.filter.page = 1
      this.fetchCashFlows()
    },
    async fetchCashFlows () {
      this.ui.isTableLoading = true
      try {
        const { data } = await getCashFlow(this.filter.hotelSn, this.filter)
        if (data?.code === repStatus.sussess) {
          this.data = data.data.cashFlowList
          this.data.unshift(data.data.statistics)
          this.pagination = data.data.meta
          this.headerContent = data.data.statistics
        }
      } catch (error) {
        return false
      } finally {
        this.$nextTick(() => {
          this.$refs.cashflowReportDetail.bodyWrapper.scrollTop = 0
        })
        scrollToTop('.el-table')
        this.ui.isTableLoading = false
      }
    },
    searchSuggestionsHotels: debounce(function (keyword) {
      this.fetchSuggestionsHotels({
        limit: 10,
        justHotel: 1,
        keyword: keyword
      })
    }, timeDebounce),
    async fetchSuggestionsHotels (params) {
      this.ui.isLoadingHotel = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.hotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingHotel = false
      }
    },
    onSizeChange (size) {
      this.filter.page = 1
      this.filter.limit = size
      this.fetchCashFlows()
    },
    onCurrentChange (currentPage) {
      this.filter.page = currentPage
      this.fetchCashFlows()
    },
    indexMethod (index) {
      return index || ''
    },
    getDeviceType (type) {
      switch (type) {
        case 0: return this.$t('option.allDevice')
        case 1: return this.$t('option.app')
        case 2: return this.$t('option.web')
      }
    },
    getBookingType (type) {
      switch (type) {
        case 1: return this.$t('option.hourly')
        case 2: return this.$t('option.overnight')
        case 3: return this.$t('option.daily')
      }
    },
    onDirectCoupon (row) {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/detail-promotion?sn=${row.promotionSn}&${dataAccountDirectToV1}`
    }
  }
}
</script>

<style lang="scss" scoped>
.blue-color{
  color: blue;
}
.purple-color{
  color: #800080;
}
.green-color{
  color: #008080;
}
.cash-flow-detail {
  &__filter {
    &--text-line {
      line-height: 24px;
    }
    &--text-distance {
      padding: 4px 0;
    }
    &--text-size {
      font-size: 13px
    }
  }
}
.el-col {
  padding: 6px 10px;
}
.w-100 {
  width: 100% !important;
}
.el-select-dropdown__item {
  height: auto;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
