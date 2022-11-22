<template>
  <sa-section class="booking-rp-hotels">
    <template slot="header" class="booking-rp-hotels__filter">
      <el-row :class="ui.isLoading ? 'is-disabled' : ''">
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-select
              class="w-100"
              v-model="filter.source"
            >
              <el-option
                v-for="(item, index) in ui.sourceOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
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
        <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="3">
          <el-select
            class="w-100"
            v-model="filter.hotelSn"
            :loading="ui.isLoadingHotels"
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
              <div class="booking-rp-hotels__filter--text-line booking-rp-hotels__filter--text-distance">
                <p>{{ item.name }}</p>
                <p class="booking-rp-hotels__filter--text-size text-grey">{{ item.address }}</p>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
          <el-select
            class="w-100"
            v-model="filter.type"
          >
            <el-option
              v-for="(item, index) in ui.timeTypeOptions"
              :key="index"
              :label="$t(`${item.key}`)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="3">
          <el-select
            class="w-100"
            v-model="filter.bookingStatus"
          >
            <el-option
              v-for="(item, index) in ui.bookingStatusOptions"
              :key="index"
              :label="$t(`${item.key}`)"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5">
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
        <el-col :xs="24" :sm="6" :md="5" :lg="3" :xl="2">
          <el-button
            class="w-100"
            type="primary"
            plain
            @click="changeFilter"
          >
            {{ $t('button.search') }}
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="6" :md="5" :lg="3" :xl="3">
          <el-button
            :loading="ui.isDowloading"
            class="w-100"
            type="success"
            icon="el-icon-download"
            plain
            :disabled="ui.isDisabledExport"
            @click="exportBookingReports"
          >
            {{ $t('button.export') }}
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="6" :md="6" :lg="4" :xl="3">
          <el-button
            class="w-100"
            type="primary"
            plain
            @click="openSwapColumnPopup"
          >
            {{ $t('page.bookingReport.adjustColumn') }}
          </el-button>
        </el-col>
      </el-row>
    </template>
    <table-booking
      :data="bookingList"
      :isLoading="ui.isLoading"
      :columns="ui.columns"
      @onCancelBooking="onCancelBooking"
      @onRefundBooking="onRefundBooking"
      @onTransferBooking="onTransferBooking"
      @onNoshowBooking="onNoshowBooking"
      @onCompleteBooking="onCompleteBooking"
    />
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
    <!-- -------------------------------------- -->
    <div>
      <popup-cancel ref="cancelModal" @onSuccess="fetchUserBookingHotels" />
      <popup-noshow ref="noshowModal" @onSuccess="fetchUserBookingHotels" />
      <popup-refund ref="refundModal" @onSuccess="fetchUserBookingHotels" />
      <popup-complete ref="completeModal" @onSuccess="fetchUserBookingHotels" />
      <popup-confirm-noshow ref="confirmNoshowModal" @onSuccess="fetchUserBookingHotels" />
      <popup-swap-column ref="swapColumnModal" @onSuccess="onChangedColumn" />
    </div>
    <!-- -------------------------------------- -->
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchUserBookingHotels } from './api'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { VIA_OBJECT, repStatus, SOURCE_OPTIONS_FILTERS, DEVICE_TYPE_OPTIONS, TIME_TYPE_OPTIONS } from '@/utils/const'
import { exportBookingReports } from '../list/api'
import { debounce } from '@/utils/helpers'
import PopupCancel from '../popup/cancel'
import PopupNoshow from '../popup/no-show'
import PopupRefund from '../popup/refund'
import PopupComplete from '../popup/complete'
import PopupSwapColumn from '../popup/swap-column'
import PopupConfirmNoshow from '../popup/confirm-no-show'
import TableBooking from '../common/table-booking.vue'

const timeDebounce = 500
const today = new Date()
export default {
  name: 'BookingReportHotels',
  components: {
    SaSection,
    PopupCancel,
    PopupNoshow,
    PopupRefund,
    PopupComplete,
    PopupConfirmNoshow,
    PopupSwapColumn,
    TableBooking
  },
  data: (vm) => {
    return {
      bookingList: [],
      hotels: [],
      pagination: {},
      filter: {
        source: 0,
        deviceType: 0,
        startDate: vm.formatDate(today, false),
        endDate: vm.formatDate(today, false),
        bookingStatus: 0,
        type: 1,
        limit: 10,
        page: 1,
        hotelSn: null,
        provinceSn: []
      },
      ui: {
        isLoading: false,
        isLoadingHotels: false,
        isDowloading: false,
        isDisabledExport: false,
        deviceTypeOptions: DEVICE_TYPE_OPTIONS,
        timeTypeOptions: TIME_TYPE_OPTIONS,
        bookingStatusOptions: [
          { value: 0, key: 'option.all' },
          { value: 1, key: 'option.awaitingPay' },
          { value: 2, key: 'option.awaitingConfirm' },
          { value: 3, key: 'option.upComing' },
          { value: 8, key: 'option.completedCheckedIn' },
          { value: 4, key: 'option.cancelled' },
          { value: 6, key: 'option.noShow' },
          { value: 7, key: 'option.waitForGo2Joy' }
        ],
        sourceOptions: SOURCE_OPTIONS_FILTERS,
        columns: [
          {
            label: 'bookingId',
            width: 160,
            show: true
          },
          {
            label: 'userInfo',
            width: 140,
            show: true
          },
          {
            label: 'hotelName',
            width: 180,
            show: true
          },
          {
            label: 'roomType',
            width: 160,
            show: true
          },
          {
            label: 'bookingStatus',
            width: 200,
            show: true
          },
          {
            label: 'paymentStatus',
            width: 180,
            show: true
          },
          {
            label: 'bookingType',
            width: 160,
            show: true
          },
          {
            label: 'stayAtHotelTime',
            width: 160,
            show: true
          },
          {
            label: 'coupon',
            width: 170,
            show: true
          },
          {
            label: 'roomRate',
            width: 160,
            show: true
          },
          {
            label: 'totalPayment',
            width: 200,
            show: true
          },
          {
            label: 'go2joyDiscount',
            width: 160,
            show: true
          },
          {
            label: 'hotelDiscount',
            width: 160,
            show: true
          },
          {
            label: 'userPay',
            width: 180,
            show: true
          },
          {
            label: 'device',
            width: 120,
            show: true
          },
          {
            label: 'source',
            width: 120,
            show: true
          },
          {
            label: 'action',
            width: 130,
            show: true
          }
        ]
      }
    }
  },
  created () {
    this.filter.source = this.$route.query.source !== null ? Number(this.$route.query.source) : 0
    this.filter.bookingStatus = Number(this.$route.query.bookingStatus) || 0
    this.filter.deviceType = Number(this.$route.query.deviceType) || 0
    this.filter.startDate = this.$route.query.startDate || 0
    this.filter.endDate = this.$route.query.endDate || 0
    this.filter.hotelSn = Number(this.$route.query.hotelSn) || null
    this.filter.type = Number(this.$route.query.type) || 0
    this.filter.provinceSn = this.$route.query.provinceSn ? `${this.$route.query.provinceSn}` : '[]'

    this.ui.isDisabledExport = !this.hasPermission('sabookingreport', 'pExport')

    this.fetchSuggestionsHotels({ limit: 10, justHotel: 1, hotelStatus: 0, hotelSn: this.filter.hotelSn })
    this.fetchUserBookingHotels()

    localStorage.setItem('column-booking-default', JSON.stringify(this.ui.columns))
    if (localStorage.getItem('column-booking-swapped')) {
      this.ui.columns = JSON.parse(localStorage.getItem('column-booking-swapped'))
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
        const days = (new Date(this.filter.endDate).getTime() - new Date(this.filter.startDate).getTime()) / (1000 * 3600 * 24)
        if (days <= 40 && this.hasPermission('sabookingreport', 'pExport')) {
          this.ui.isDisabledExport = false
        } else {
          this.ui.isDisabledExport = true
        }
      }
    }
  },
  methods: {
    openSwapColumnPopup () {
      const columnDetault = JSON.parse(localStorage.getItem('column-booking-default'))
      const columnSwaped = localStorage.getItem('column-booking-popup')
      this.$nextTick(() => {
        if (columnSwaped) {
          this.$refs.swapColumnModal.open(JSON.parse(columnSwaped), columnDetault)
        } else {
          this.$refs.swapColumnModal.open(this.ui.columns, columnDetault)
        }
      })
    },
    onChangedColumn (columnBookingPopup) {
      const columnBookingSwapped = columnBookingPopup.filter(x => x.show === true)
      this.ui.columns = []
      this.$nextTick(() => {
        this.ui.columns = columnBookingSwapped
      })
      localStorage.setItem('column-booking-swapped', JSON.stringify(columnBookingSwapped))
      localStorage.setItem('column-booking-popup', JSON.stringify(columnBookingPopup))
    },
    // set query router when user change filter
    changeFilter () {
      this.setQueryRouter()
    },
    setQueryRouter () {
      this.filter.page = 1
      this.$router.push({
        name: 'bookingReportHotels',
        query: {
          source: this.filter.source,
          hotelSn: this.filter.hotelSn,
          deviceType: this.filter.deviceType,
          startDate: this.filter.startDate,
          endDate: this.filter.endDate,
          type: this.filter.type
        }
      })
      this.fetchUserBookingHotels()
    },
    searchSuggestionsHotels: debounce(function (keySearch) {
      this.fetchSuggestionsHotels({
        limit: 10,
        justHotel: 1,
        hotelStatus: 0,
        keyword: keySearch
      })
    }, timeDebounce),
    async fetchSuggestionsHotels (params) {
      this.ui.isLoadingHotels = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.hotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingHotels = false
      }
    },
    async fetchUserBookingHotels () {
      this.ui.isLoading = true
      try {
        const formData = { ...this.filter }

        const { data } = await fetchUserBookingHotels(formData)
        if (data?.code === repStatus.sussess) {
          this.bookingList = data.data?.bookingList
          this.pagination = data.data?.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoading = false
      }
    },
    async exportBookingReports () {
      this.ui.isDowloading = true
      try {
        const params = {
          ...this.filter
        }

        delete params.page
        delete params.limit
        if (!params.hotelSn) {
          params.hotelSn = ''
        }
        const { data } = await exportBookingReports(params)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: this.$t('page.bookingReport.exportSuccess')
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isDowloading = false
      }
    },
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchUserBookingHotels()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchUserBookingHotels()
    },
    onCancelBooking (data) {
      this.$refs.cancelModal.open(data)
    },
    onRefundBooking (data) {
      this.$refs.refundModal.open(data)
    },
    onTransferBooking (data) {
      this.$router.push({ name: 'bookingReportTransfer', params: { sn: data.sn } })
    },
    onNoshowBooking (data) {
      if (this.isAwaitingGo2JoyProcessing(data) && data.viaObject === VIA_OBJECT.h && data.reasonForNoShow) {
        this.$refs.confirmNoshowModal.open(data)
      } else {
        this.$refs.noshowModal.open(data)
      }
    },
    onCompleteBooking (data) {
      this.$refs.completeModal.open(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.booking-rp-hotels {
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
</style>
