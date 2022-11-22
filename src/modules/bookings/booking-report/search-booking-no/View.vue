<template>
  <sa-section class="search-booking">
    <template slot="header">
      <el-row :class="ui.loadingBookingDetails ? 'is-disabled' : ''">
        <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="3">
          <el-select
            class="w-100"
            v-model="filter.type"
          >
            <el-option
              v-for="item in ui.types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          </el-col>
        <el-col v-show="filter.type === 0" :xs="24" :sm="8" :md="6" :lg="6" :xl="4">
          <el-input
            class="w-100"
            v-model="filter.bookingNo"
            :placeholder="$t('page.bookingReport.booking_no_placeholder')"
            clearable
            prefix-icon="el-icon-search"
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
      :isLoading="ui.loadingBookingDetails"
      :columns="ui.columns"
      @onCancelBooking="onCancelBooking"
      @onRefundBooking="onRefundBooking"
      @onTransferBooking="onTransferBooking"
      @onNoshowBooking="onNoshowBooking"
      @onCompleteBooking="onCompleteBooking"
    />
    <template slot="footer">
      <el-pagination
        :class="ui.loadingBookingDetails ? 'is-disabled' : ''"
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
      <popup-cancel ref="cancelModal" @onSuccess="fetchBookingDetails" />
      <popup-noshow ref="noshowModal" @onSuccess="fetchBookingDetails" />
      <popup-refund ref="refundModal" @onSuccess="fetchBookingDetails" />
      <popup-complete ref="completeModal" @onSuccess="fetchBookingDetails" />
      <popup-confirm-noshow ref="confirmNoshowModal" @onSuccess="fetchBookingDetails" />
      <popup-swap-column ref="swapColumnModal" @onSuccess="onChangedColumn" />
    </div>
    <!-- -------------------------------------- -->
  </sa-section>
</template>
<script>
import { fetchBookingDetail } from './api'
import SaSection from '@/components/globals/SaSection.vue'
import { VIA_OBJECT, repStatus } from '@/utils/const'
import PopupCancel from '../popup/cancel'
import PopupNoshow from '../popup/no-show'
import PopupRefund from '../popup/refund'
import PopupComplete from '../popup/complete'
import PopupSwapColumn from '../popup/swap-column'
import PopupConfirmNoshow from '../popup/confirm-no-show'
import TableBooking from '../common/table-booking.vue'

export default {
  name: 'SearchByBookingNo',
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
      pagination: {},
      filter: {
        limit: 10,
        page: 1,
        type: 0,
        bookingNo: ''
      },
      ui: {
        types: [
          { label: vm.$t('page.bookingReport.booking_no_placeholder'), value: 0 },
          { label: vm.$t('page.bookingReport.canceled_booking'), value: 1 }
        ],
        loadingBookingDetails: false,
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
    this.filter.type = Number(this.$route.query.type) || 0
    this.filter.bookingNo = this.$route.query.bookingNo ?? ''

    localStorage.setItem('column-booking-default', JSON.stringify(this.ui.columns))
    if (localStorage.getItem('column-booking-swapped')) {
      this.ui.columns = JSON.parse(localStorage.getItem('column-booking-swapped'))
    }

    if (this.filter.bookingNo) {
      this.changeFilter()
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
    changeFilter () {
      this.filter.page = 1
      this.fetchBookingDetails()
      this.setQueryRouter()
    },
    setQueryRouter () {
      this.filter.bookingNo = this.filter.type === 0 ? this.filter.bookingNo : ''
      this.$router.replace({ name: 'searchByBookingNo', query: { type: this.filter.type, bookingNo: this.filter.bookingNo } })
    },
    async fetchBookingDetails () {
      this.ui.loadingBookingDetails = true
      try {
        const { data } = await fetchBookingDetail(this.filter)
        if (data?.code === repStatus.sussess) {
          this.bookingList = data.data?.bookingList
          this.pagination = data.data?.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingBookingDetails = false
      }
    },
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchBookingDetails()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchBookingDetails()
    },
    changeType () {
      this.$router.push({ name: 'searchByBookingNo', query: { type: this.filter.type } })
    },
    onDirectTransfer (data) {
      this.$router.push({ name: 'bookingReportTransfer', params: { sn: data.sn }, query: { type: this.filter.type, bookingNo: this.filter.bookingNo } })
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
.el-col {
  padding: 6px 10px;
}
.operations-btn {
  width: 150px
}
</style>
