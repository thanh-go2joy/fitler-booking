<template>
  <sa-section>
    <el-table ref="elTableBooking" :data="dataList" v-loading="isLoading" max-height="580px">
      <el-table-column v-for="column in columns"
        :key="column.label"
        :label="column.show ? `${$t('page.bookingReport.'+column.label)}` : null"
        :fixed="setFixed(column)"
        :min-width="column.show ? column.width : 0">
        <template v-if="column.show" slot-scope="scope">
            <div v-if="column.label === 'bookingId'">
              <p>
                <router-link
                  :to="{ name: 'firstBookingDetails', params: { sn: scope.row.sn}}"
                >
                  {{ scope.row.bookingNo }}
                </router-link>
                <el-tooltip v-if="setIDBookingNo(scope.row)" class="ml-4" effect="light" :content="setIDBookingNo(scope.row)" placement="bottom">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
                <img
                  v-if="isDangerImage(scope.row)"
                  class="ml-4"
                  :src="ui.dangerSrc"
                  alt="go2jot_danger"
                  width="20"
                >
              </p>
              <p>{{ formatDateUI(scope.row.createTime) }}</p>
            </div>
            <div v-else-if="column.label === 'userInfo'">
              <!-- <router-link :to="{ name: 'userDetails', params: { sn: scope.row.appUserSn } }">
                {{ scope.row.appUserNickName }}
              </router-link> -->
              <el-link @click="onDirectUserDetail(scope.row)" :underline="false" type="primary">{{ scope.row.appUserNickName }}</el-link>
              <p>{{ scope.row.mobile }}</p>
              <img v-if="scope.row.giftDescription" :src="ui.giftboxSrc" alt="giftbox" width="20" style="margin-right: 4px">
              <img v-if="scope.row.bonusHour > 0" :src="ui.clockSrc" alt="clock" width="20">
            </div>
            <div v-else-if="column.label === 'hotelName'">
              <!-- <router-link :to="{ name: 'hotelDisplayDetails', params: { sn: scope.row.hotelSn } }">
                {{ scope.row.hotelName }}
              </router-link> -->
              <el-link @click="onDirectHotelDetail(scope.row)" :underline="false" type="primary">{{ scope.row.hotelName }}</el-link>
              <p>{{ scope.row.hotelCode }}</p>
            </div>
            <div v-else-if="column.label === 'roomType'">
              <!-- <router-link :to="{ name: 'detailRoomType', params: { sn: scope.row.roomTypeSn } }">
                {{ scope.row.roomTypeName }}
              </router-link> -->
              <el-link @click="onDirectRoomTypeDetail(scope.row)" :underline="false" type="primary">{{ scope.row.roomTypeName }}</el-link>
            </div>
            <div v-else-if="column.label === 'bookingStatus'">
              <span class="dot" :class="setClassBookingStatus(scope.row)"></span>
              <span>{{ setBookingStatus(scope.row) }}</span>
              <el-tooltip v-if="setReasonBookingStatus(scope.row)" class="ml-4" effect="light" :content="setReasonBookingStatus(scope.row)" placement="bottom">
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <p v-if="setTextCancellation(scope.row)" class="text-danger">{{ setTextCancellation(scope.row) }} </p>
              <p v-if="isShowLastUpdate(scope.row)" class="text-grey">{{ formatDateUI(scope.row.lastUpdate) }}</p>
            </div>
            <div v-else-if="column.label === 'paymentStatus'">
              <p>{{ setPaymentStatus(scope.row.paymentStatus) }}</p>
            <p v-if="!isUnpaid(scope.row)">{{ setPaymentProvider(scope.row.paymentProvider) }}</p>
            </div>
            <div v-else-if="column.label === 'bookingType'">
              {{ setBookingType(scope.row.type) }}
            </div>
            <div v-else-if="column.label === 'stayAtHotelTime'">
              <p>{{ setCheckInDatePlan(scope.row) }}</p>
            </div>
            <div v-else-if="column.label === 'coupon'">
              <!-- <router-link
                v-if="scope.row.promotionSn"
                :to="{
                  name: 'promotionDetails',
                  params: {
                    promotionSn: scope.row.promotionSn,
                    couponSn: scope.row.couponSn
                  }
                }"
              >
                {{ scope.row.couponName }}
                <span>{{ setCoupon(scope.row) }}</span>
              </router-link> -->
              <el-link v-if="scope.row.promotionSn" @click="onDirectPromotionDetail(scope.row)" :underline="false" type="primary">
                {{ scope.row.couponName }}
                <span>{{ setCoupon(scope.row) }}</span>
              </el-link>
              <p v-else>{{ setCoupon(scope.row) }}</p>
            </div>
            <div v-else-if="column.label === 'roomRate'">
              {{ formatMoney(scope.row.roomTypeAmount) }} đ
            </div>
            <div v-else-if="column.label === 'totalPayment'">
              {{ formatMoney(scope.row.totalAmount) }} đ
            </div>
            <div v-else-if="column.label === 'go2joyDiscount'">
              {{ formatMoney(scope.row.totalGo2joyDiscount) }} đ
            </div>
            <div v-else-if="column.label === 'hotelDiscount'">
              {{ formatMoney(scope.row.totalHotelDiscount) }} đ
            </div>
            <div v-else-if="column.label === 'userPay'">
              {{ formatMoney(scope.row.amountFromUser) }} đ
            </div>
            <div v-else-if="column.label === 'device'">
              {{ setDeviceType(scope.row.deviceType) }}
            </div>
            <div v-else-if="column.label === 'source'">
              {{ setSource(scope.row) }}
            </div>
            <div v-else-if="column.label === 'action'">
              <el-popover
                placement="left"
                trigger="click"
              >
                <el-button
                  v-show="isShowOperations(scope.row)"
                  slot="reference" type="primary" plain size="small">
                    {{ $t('action')}}
                    <i class="el-icon-caret-bottom"></i>
                  </el-button>
                  <el-row :gutter="20" class="operations-btn">
                    <el-col v-show="isShowCancelButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <el-button
                        class="w-100"
                        type="primary"
                        plain
                        size="small"
                        @click="onCancelBooking(scope.row)"
                      >
                        {{ $t('button.cancelRoom') }}
                      </el-button>
                    </el-col>
                    <el-col v-show="isShowNoShowButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <el-button
                        class="w-100"
                        type="primary"
                        plain
                        size="small"
                        @click="onNoshowBooking(scope.row)"
                      >
                        {{ $t('button.noShow') }}
                      </el-button>
                    </el-col>
                    <el-col v-show="isShowTransferButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <el-button
                        :disabled="scope.row.isTransferred"
                        class="w-100"
                        type="primary"
                        plain
                        size="small"
                        @click="onTransferBooking(scope.row)"
                      >
                        {{ $t('button.transfer') }}
                      </el-button>
                    </el-col>
                    <el-col v-show="isShowCompleteButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <el-button
                        class="w-100"
                        type="primary"
                        plain
                        size="small"
                        @click="onCompleteBooking(scope.row)"
                      >
                        {{ $t('button.completed') }}
                      </el-button>
                    </el-col>
                    <el-col v-show="isShowRefundButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <el-button
                        class="w-100"
                        type="warning"
                        plain
                        size="small"
                        @click="onRefundBooking(scope.row)"
                      >
                        {{ $t('button.refund') }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-popover>
              </div>
            <div v-else>{{ column.formatter(scope.row) }}</div>
          </template>
      </el-table-column>
    </el-table>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { BOOKING_STATUS, BOOKING_SOURCE, BOOKING_ORIGIN } from '@/utils/const'
import { scrollToTop } from '@/utils/helpers'

export default {
  name: 'TableBooking',
  props: {
    data: [],
    columns: [],
    isLoading: {}
  },
  components: {
    SaSection
  },
  data: () => {
    return {
      listSuggestionsHotels: [],
      pagination: {},
      ui: {
        dangerSrc: require('@/assets/images/svg/danger.png'),
        giftboxSrc: require('@/assets/images/svg/gifts.svg'),
        clockSrc: require('@/assets/images/svg/clock.svg')
      },
      isFixedRight: null,
      isFixedLeft: null
    }
  },
  computed: {
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.data
    }
  },
  methods: {
    onDirectUserDetail (row) {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/users-detail?sn=${row.appUserSn}&${dataAccountDirectToV1}`
    },
    onDirectHotelDetail (row) {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/detail-hotel-display-mgt?sn=${row.hotelSn}&${dataAccountDirectToV1}`
    },
    onDirectRoomTypeDetail (row) {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/view-room-type?sn=${row.roomTypeSn}&${dataAccountDirectToV1}`
    },
    onDirectPromotionDetail (row) {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/detail-promotion?sn=${row.promotionSn}&${dataAccountDirectToV1}`
    },
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = this.isFixedRight = null
      } else {
        this.isFixedLeft = !this.isLoading ? 'left' : null
        this.isFixedRight = !this.isLoading ? 'right' : null
      }
      this.$nextTick(() => {
        this.$refs.elTableBooking.bodyWrapper.scrollTop = 0
      })
    },
    setFixed (column) {
      if (column.label === 'bookingId') return this.isFixedLeft
      if (column.label === 'userInfo') return this.isFixedLeft
      else if (column.label === 'action') return this.isFixedRight
      return null
    },
    isShowLastUpdate (row) {
      return this.isComplete(row) || this.isNoshow(row) || this.isCancelled(row)
    },
    isDangerImage (row) {
      return row.bookingStatus === BOOKING_STATUS.complete && row.infoTransfer
    },
    isShowOperations (row) {
      return this.isShowCancelButton(row) || this.isShowCompleteButton(row) || this.isShowTransferButton(row) || this.isShowNoShowButton(row) || this.isShowRefundButton(row)
    },
    setIDBookingNo (row) {
      if (row.origin === BOOKING_ORIGIN.agoda || row.source === BOOKING_SOURCE.momo) {
        if (row.origin === BOOKING_ORIGIN.agoda) {
          return `Agoda ID: ${row.partnerUserBookingId}`
        } else if (row.source === BOOKING_SOURCE.momo) {
          return `Partner ID: ${row.partnerUserBookingId}`
        }
      }
    },
    setSource (row) {
      return row.source !== BOOKING_SOURCE.momo ? 'Go2Joy' : 'MoMo'
    },
    setCheckInDatePlan (row) {
      if (row.type === 1) return `${this.formatTime(row.startTime)} - ${this.formatTime(row.endTime)} ${this.formatDateUI(row.checkInDatePlan, false)}`
      else if (row.type === 3) return `${this.formatDateUI(row.checkInDatePlan, false)} ${this.formatDateUI(row.endDate, false)}`
      else return this.formatDateUI(row.checkInDatePlan, false)
    },
    setCoupon (row) {
      if (row.discountType) {
        if (row.discountType === 2) return `${row.discount}%`
        else if (row.discountType === 5) return `${this.formatMoney(row.discount)} ${this.$t('page.bookingReport.discountType')}`
        else return ''
      } else return 'N/A'
    },
    onCancelBooking (data) {
      this.$emit('onCancelBooking', data)
    },
    onRefundBooking (data) {
      this.$emit('onRefundBooking', data)
    },
    onTransferBooking (data) {
      this.$emit('onTransferBooking', data)
    },
    onNoshowBooking (data) {
      this.$emit('onNoshowBooking', data)
    },
    onCompleteBooking (data) {
      this.$emit('onCompleteBooking', data)
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
.el-popover {
  .el-row {
    margin: 4px 0 !important;
  }
  .el-col {
    padding: 2px 10px;;
    button {
      margin: 2px 0;
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
.operations-btn {
  width: 150px
}
</style>
