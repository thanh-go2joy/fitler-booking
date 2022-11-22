<template>
  <sa-section
    class="revenue-details"
  >
    <template slot="header">
      <div class="revenue-details__filter" :class="ui.isLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="9" :md="8" :lg="6" :xl="5">
            <el-select
              class="w-100"
              v-model="hotelSelected"
              :loading="ui.hotelsLoading"
              :placeholder="$t('page.bookingReport.hotel_name')"
              remote
              filterable
              :remote-method="searchSuggestionsHotels"
              prefix-icon="el-icon-search"
              clearable
              value-key="sn"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="(item, index) in listSuggestionsHotels"
                :key="index"
                :label="item.name"
                :value="item"
              >
                <div class="revenue-details__filter--text-line revenue-details__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="revenue-details__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
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
          <el-col :xs="24" :sm="5" :md="4" :lg="3" :xl="2">
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
      </div>

      <el-row class="flex-center">
        <el-col :xs="12" :sm="10" :md="8" :lg="3" :xl="3">
          <b>{{ $t('page.revenueReport.paidInAdvance') }}</b>
        </el-col>
        <el-col :xs="24" :sm="10" :md="6" :lg="6" :xl="3">
          <el-input type="text" disabled="disabled" :value="formatMoneyUI(statistics.payInAdvance)"></el-input>
        </el-col>
      </el-row>
      <el-row class="flex-center">
        <el-col :xs="12" :sm="10" :md="8" :lg="3" :xl="3">
          <b>{{ $t('page.revenueReport.balance') }}</b>
        </el-col>
        <el-col :xs="24" :sm="10" :md="6" :lg="6" :xl="3">
          <el-input type="text" disabled="disabled" :value="formatMoneyUI(statistics.balance)"></el-input>
        </el-col>
      </el-row>
    </template>
    <el-table
      ref="revenueDetails"
      max-height="580px"
      :data="dataList"
      v-loading="ui.isLoading"
    >
      <el-table-column min-width="140" :fixed="isFixedLeft"
        :label="$t('page.revenueReport.bookingTime')"
      >
        <template slot-scope="scope">
          {{ formatDateUI(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column min-width="140" :fixed="isFixedLeft"
        prop="bookingNo"
        :label="$t('page.revenueReport.bookingId')"
      ></el-table-column>
      <el-table-column min-width="160"
        prop="transactionId"
        :label="$t('page.revenueReport.transactionId')"
      >
      </el-table-column>
      <el-table-column min-width="180" :fixed="isFixedLeft"
        :label="$t('page.revenueReport.bookingInfo')"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.total">
            <p>{{ scope.row.mobile}}</p>
            <router-link :to="{name: 'detailRoomType', params: { sn: scope.row.roomTypeSn }}">
              {{ scope.row.roomTypeName}}
            </router-link>
            <p>
              {{ getBookingType(scope.row.userBookingType)}}
              {{ scope.row.checkInDatePlan ? `: ${formatDateUI(scope.row.checkInDatePlan, false)}` : '' }}
              <span v-if="scope.row.userBookingType === 3">{{ scope.row.endDate }}</span>
            </p>
            <p v-if="scope.row.userBookingType === 1">
              {{ formatTime(scope.row.startTime) }} ~ {{ formatTime(scope.row.endTime) }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="200">
        <template slot="header">
          <p>{{ $t('page.revenueReport.transactionStatus') }}</p>
          <p class="text-secondary">{{ $t('page.revenueReport.transactionTime') }}</p>
        </template>
        <template slot-scope="scope">
          <p v-if="!scope.row.total">
            <span>{{ setStatus(scope.row) }} </span>
            <span>{{ setTransaction(scope.row) }}</span>
          </p>
          <p class="text-secondary">{{ formatDateUI(scope.row.transactionTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="140"
        prop="couponName"
        :label="$t('page.revenueReport.coupon')"
      ></el-table-column>
      <el-table-column min-width="180">
        <template slot="header">
          <p>{{ $t('page.revenueReport.totalAmount') }}</p>
          <p class="text-secondary">{{ $t('page.revenueReport.roomAmount') }}</p>
          <p class="text-orange-2">{{ $t('page.revenueReport.extraFee') }}</p>
          <p class="text-success">{{ $t('page.revenueReport.productAmount') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.totalAmount) }}</p>
          <p class="text-secondary">{{ formatMoneyUI(scope.row.roomAmount) }}</p>
          <p class="text-orange-2">{{ formatMoneyUI(scope.row.extraFee) }}</p>
          <p class="text-success">{{ formatMoneyUI(scope.row.productAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="180">
        <template slot="header">
          <p>{{ $t('page.revenueReport.go2joyDiscount') }}</p>
          <p class="text-secondary">{{ $t('page.revenueReport.coupon') }}</p>
          <p class="text-orange-2">{{ $t('page.revenueReport.mileagePoint') }}</p>
          <p class="text-success">{{ $t('page.revenueReport.otherDiscount') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.go2joyDiscount) }}</p>
          <p class="text-secondary">{{ formatMoneyUI(scope.row.go2joyCoupon) }}</p>
          <p class="text-orange-2">{{ formatMoneyUI(scope.row.mileagePoint) }}</p>
          <p class="text-success">{{ formatMoneyUI(scope.row.otherDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="180">
        <template slot="header">
          <p>{{ $t('page.revenueReport.hotelDiscount') }}</p>
          <p class="text-secondary">{{ $t('page.revenueReport.coupon') }}</p>
          <p class="text-orange-2">{{ $t('page.revenueReport.flashSale') }}</p>
          <p class="text-success">{{ $t('page.revenueReport.redeemStamp') }}</p>
          <p class="text-danger">{{ $t('page.revenueReport.directDiscount') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.hotelDiscount) }}</p>
          <p class="text-secondary">{{ formatMoneyUI(scope.row.hotelCoupon) }}</p>
          <p class="text-orange-2">{{ formatMoneyUI(scope.row.flashSale) }}</p>
          <p class="text-success">{{ formatMoneyUI(scope.row.redeemStamp) }}</p>
          <p class="text-danger">{{ formatMoneyUI(scope.row.directDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160"
        :label="$t('page.revenueReport.userPay')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.userPay) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="130"
        :label="$t('page.revenueReport.commission')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.commission) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>{{ $t('page.revenueReport.balance') }}</p>
          <p>{{ $t('page.revenueReport.receivable') }}</p>
          <p>{{ $t('page.revenueReport.payable') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.balance) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="130"
        :label="$t('page.revenueReport.paidInAdvance')"
      >
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.payInAdvance) }}</p>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :class="ui.isLoading ? 'is-disabled' : ''"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.perPage"
        :current-page="pagination.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </template>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { debounce, scrollToTop } from '@/utils/helpers'
import { fetchTransactions } from './api'
import { repStatus, TRANSACTION_TYPE, TRANSACTION_STATUS } from '@/utils/const'

const timeDebounce = 500
export default {
  name: 'revenueReportDetails',
  components: { SaSection },
  data: (vm) => {
    return {
      ui: {
        isLoading: false
      },
      filter: {
        hotelSn: vm.$route.params.sn,
        limit: 10,
        page: 1,
        keyword: '',
        startDate: vm.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), false),
        endDate: vm.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), false)
      },
      pagination: {
        perPage: 1,
        total: 0
      },
      hotelSelected: '',
      statistics: {},
      transactions: [],
      listSuggestionsHotels: [],
      isFixedLeft: false
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
    },
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.transactions
    }
  },
  watch: {
    hotelSelected (value) {
      if (this.filter.hotelGroupSn) {
        delete this.filter.hotelGroupSn
      } else if (this.filter.hotelSn) {
        delete this.filter.hotelSn
      }
      if (value) {
        this.filter[value.hotelStatus === -1 ? 'hotelGroupSn' : 'hotelSn'] = value.sn
      }
    }
  },
  created () {
    this.fetchSuggestionsHotels({ limit: 10 })
    this.changeFilter()
  },
  methods: {
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = null
      } else {
        this.isFixedLeft = !this.ui.isLoading ? 'left' : null
      }
      this.$nextTick(() => {
        this.$refs.revenueDetails.bodyWrapper.scrollTop = 0
      })
    },
    setStatus (row) {
      if (row.transactionStatus === TRANSACTION_STATUS.completed) return 'Completed'
      else if (row.transactionStatus === TRANSACTION_STATUS.cancelled) return 'Cancelled'
      else if (row.transactionStatus === TRANSACTION_STATUS.noShow) return 'No show'
      else return ''
    },
    setTransaction (row) {
      if (row.transactionType === TRANSACTION_TYPE.origin) return '(Origin)'
      else if (row.transactionType === TRANSACTION_TYPE.transfer) return '(Transfer)'
      else return ''
    },
    getBookingType (type) {
      switch (type) {
        case 1: return this.$t('option.hourly')
        case 2: return this.$t('option.overnight')
        case 3: return this.$t('option.daily')
      }
    },
    changeFilter () {
      this.filter.page = 1
      this.fetchTransactions()
    },
    searchSuggestionsHotels: debounce(function (keySearch) {
      this.fetchSuggestionsHotels({
        limit: 10,
        keyword: keySearch
      })
    }, timeDebounce),
    async fetchSuggestionsHotels (params) {
      this.ui.hotelsLoading = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        this.listSuggestionsHotels = data.data.hotels
      } catch (error) {
        return false
      } finally {
        this.ui.hotelsLoading = false
      }
    },
    async fetchTransactions () {
      try {
        this.ui.isLoading = true
        const { data } = await fetchTransactions(this.filter)
        if (data?.code === repStatus.sussess) {
          this.pagination = data.data.meta
          this.transactions = data.data.transactions
          this.statistics = data.data.statistics
          this.statistics.total = true
          this.transactions.unshift(this.statistics)
          this.paginations = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoading = false
      }
    },
    // pagination event
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchTransactions()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchTransactions()
    }
  }
}
</script>
<style lang="scss" scoped>
.revenue-details {
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
  :deep(.el-button), :deep(.el-select) {
    width: 100%;
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
