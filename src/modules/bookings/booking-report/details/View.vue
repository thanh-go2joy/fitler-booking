<template>
  <sa-section
    class="first-booking"
    v-loading="ui.isLoading"
  >

    <div class="booking-detail-content">
      <div>
        <div class="booking-detail">
          <!-- HOTEL INFO -->
          <div class="booking-detail__hotel-info">
            <el-row :gutter="20">
              <!-- Name hotel -->
              <el-col class="check-device-screen" :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
                <b class="is-name-hotel">{{ firstBookingDetails.hotelName }}</b>
                <p><b class="is-name-hotel is-color-go2joy"> {{ formatMoney(firstBookingDetails.amountFromUser) }} đ</b></p>
              </el-col>
              <!-- booking No -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p class="is-title-detail">{{ $t(`page.bookingReport.bookingNo`) }}</p>
                <p class="is-data-detail">{{firstBookingDetails.bookingNo}}</p>
              </el-col>
              <!-- Booking type -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p is-title-detail>{{ $t(`page.bookingReport.booking_type`) }}</p>
                <span class="is-data-detail" v-if="firstBookingDetails.type === 1">
                {{ $t('page.firstBooking.hours') }}
                </span>
                <span class="is-data-detail" v-else-if="firstBookingDetails.type === 2">
                  {{ $t('page.firstBooking.overnight') }}
                </span>
                <span class="is-data-detail" v-else-if="firstBookingDetails.type === 3">
                  {{ $t('page.firstBooking.daily') }}
                </span>
              </el-col>
              <!-- Booking Status -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p class="is-title-detail">{{ $t(`page.bookingReport.booking_status`) }}</p>
                <div class="is-data-detail">
                  <span>
                    {{ setBookingStatus(firstBookingDetails) }}
                  </span>
                </div>
              </el-col>
              <!-- Stay at hotel time -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p class="is-title-detail">{{ $t(`page.bookingReport.stay_at_hotel_time`) }}</p>
                <p class="is-data-detail">
                  <span v-if="firstBookingDetails.type == 1">
                  {{ formatTime(firstBookingDetails.startTime) }}
                  <span v-if="firstBookingDetails.endTime != null || firstBookingDetails.endTime != ''">
                    - {{ formatTime(firstBookingDetails.endTime) }}
                  </span>
                  {{ formatDateUI(firstBookingDetails.checkInDatePlan, false) }}
                  </span>
                  <span v-else-if="firstBookingDetails.type == 2">
                    {{ formatDateUI(firstBookingDetails.checkInDatePlan, false) }}
                  </span>
                  <span v-else-if="firstBookingDetails.type == 3">
                    {{ formatDateUI(firstBookingDetails.checkInDatePlan, false) }}- {{ formatDateUI(firstBookingDetails.endDate, false) }}
                  </span>
                </p>
              </el-col>
              <!-- Payment Status -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p class="is-title-detail">{{ $t(`page.bookingReport.paymentStatus`) }}</p>
                <div class="is-data-detail">
                  <p>{{ setPaymentStatus (firstBookingDetails.paymentStatus) }}
                    <span v-if="firstBookingDetails.paymentStatus !==0 && firstBookingDetails.paymentStatus !== 2">({{ setPaymentProvider(firstBookingDetails.paymentProvider)}})</span></p>
                </div>
              </el-col>
              <!-- Info  -->
              <el-col :xs="24" :sm="24" :md="8" :lg="9" :xl="9">
                <p class="is-title-detail">{{ $t(`page.bookingReport.guestInformation`) }}</p>
                <div class="is-data-detail">
                  <p>{{ firstBookingDetails.appUserNickName }}<span v-if="firstBookingDetails.mobile && firstBookingDetails.appUserNickName">,</span> <span >{{firstBookingDetails.mobile}}</span></p>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- BOOKING INFO -->
          <div class="booking-detail__booking-info" :class="seeMore? 'hidden-content': 'show-content'">
            <el-row :gutter="20">
              <!--Room Rate -->
              <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.roomRate`) }}</p>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="18" :xl="18">
                <div class="is-data-detail">
                  <p>{{ formatMoney(firstBookingDetails.roomTypeAmount) }} đ</p>
                </div>
              </el-col>
              <!-- Extra Fee -->
              <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.extra_fee`) }}</p>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="18" :xl="18">
                <div class="is-data-detail">
                  <p>{{ formatMoney(firstBookingDetails.extraFee) }} đ</p>
                </div>
              </el-col>

              <!-- Product hotel -->
              <el-col v-if="hotelProductList.length" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-tree
                default-expand-all
                :data="hotelProductList" :class="firstBookingDetails.hotelProductList?.length === 0 ? 'display-none-icon' : ''"
                >
                  <div class="custom-tree-node" slot-scope="{ data }">
                    <p v-if="getLocalize === 'vi'">
                      <span class="is-limit-text">{{ data.name }}</span>
                      <span class="is-limit-text" v-if="data.num">x{{ data.num }}</span>
                    </p>
                    <p v-else>
                      <span class="is-limit-text">{{ data.nameEn }}</span>
                      <span class="is-limit-text" v-if="data.num">x{{ data.num }}</span>
                    </p>
                    <span class="is-price-tree">{{ formatMoney(data.price) }} đ</span>
                  </div>
                </el-tree>
              </el-col>

              <!-- HR -->
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>
              <!-- Total Price -->
              <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.total`) }}</p>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="18" :xl="18">
                <div class="is-data-detail">
                  <p>{{ formatMoney(firstBookingDetails.totalAmount) }} đ</p>
                </div>
              </el-col>
              <!-- HR -->
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>

              <!-- G2J Discount -->
              <el-col v-if="dataG2JDiscount.length" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-tree
                default-expand-all
                :data="dataG2JDiscount">
                  <div class="custom-tree-node" slot-scope="{ data }">
                    <span v-if="getLocalize === 'vi'">{{ data.name }}
                    </span>
                    <span v-else>{{ data.nameEn }}
                    </span>
                    <div class="is-price-tree">{{ formatMoney(data.price) }} đ  <span v-if="data.couponName" class="style-coupon" >
                      <li  class="style-dot">
                        <router-link
                        :to="{
                          name: 'promotionDetails',
                          params: {
                            promotionSn: data.promotionSn,
                            couponSn: data.couponSn
                          }
                        }"
                      >
                        {{ data.couponName }}
                      </router-link>
                      </li>
                      </span>
                    </div>

                  </div>
                </el-tree>
              </el-col>
              <!-- HR -->
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>

              <!-- Hotel Discount -->
              <el-col v-if="dataHotelDiscount.length" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-tree
                default-expand-all
                :data="dataHotelDiscount">
                  <div class="custom-tree-node" slot-scope="{ data }">
                    <span v-if="getLocalize === 'vi'">{{ data.name }}
                    </span>
                    <span v-else>{{ data.nameEn }}
                    </span>
                    <span class="is-price-tree">{{ formatMoney(data.price) }} đ<span v-if="data.couponName" class="style-coupon" >
                      <li  class="style-dot">
                        <router-link
                        :to="{
                          name: 'promotionDetails',
                          params: {
                            promotionSn: data.promotionSn,
                            couponSn: data.couponSn
                          }
                        }"
                      >
                        {{ data.couponName }}
                      </router-link>
                      </li>
                      </span></span>
                  </div>
                </el-tree>
              </el-col>
              <!-- HR -->
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>
              <!-- total Guest Paid  -->
              <el-col :xs="16" :sm="12" :md="8" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.totalGuestPaid`) }}</p>
              </el-col>
              <el-col :xs="8" :sm="12" :md="18" :lg="18" :xl="18">
                <div class="is-data-detail is-color-go2joy" style="font-size:20px">
                  <p>{{ formatMoney(firstBookingDetails.amountFromUser) }} đ</p>
                </div>
              </el-col>
              <!-- HR -->
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>
              <!-- Total Paid In Advance  -->
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="16" :sm="12" :md="8" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.paidInAdvance`) }}</p>
              </el-col>
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="8" :sm="12" :md="18" :lg="18" :xl="18">
                <div class="is-data-detail">
                  <p>{{ formatMoney(firstBookingDetails.prepayAmount) }} đ <span v-if="firstBookingDetails.paymentStatus !==0 && firstBookingDetails.paymentStatus !== 2">({{ setPaymentProvider(firstBookingDetails.paymentProvider)}})</span></p>
                </div>
              </el-col>
              <!-- HR -->
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>
              <!-- Total Refunded  -->
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="16" :sm="12" :md="8" :lg="6" :xl="6">
                <p class="is-title-detail">{{ $t(`page.bookingReport.refunded`) }}</p>
              </el-col>
              <el-col v-show="isShowPayOnline(firstBookingDetails)" :xs="8" :sm="12" :md="18" :lg="18" :xl="18">
                <div class="is-data-detail" style="padding-bottom:16px">
                  <p>{{ formatMoney(firstBookingDetails.refunded) }} đ <span v-if="firstBookingDetails.paymentStatus !==0 && firstBookingDetails.paymentStatus !== 2 && firstBookingDetails.refunded">({{ setPaymentProvider(firstBookingDetails.paymentProvider)}})</span></p>
                  <p class="is-refunded-info">{{ formatDateUI(firstBookingDetails.refundTime)}} <ul><li style="list-style: disc;" v-if="firstBookingDetails.staffRefundName"> {{ firstBookingDetails.staffRefundName }}</li></ul></p>
                </div>
              </el-col>
            </el-row>
            <!-- HR -->
            <div class="hr-section-transfer" v-if="noShowHistory?.hotelAction === 0"></div>
            <!--APPLY BOOKING TRANSFER -->
            <div class="content-no-show-section" v-if="noShowHistory?.hotelAction === 0">
                <div class="is-icon-transfer">
                  <i class="el-icon-warning-outline" />
                </div>
                <div class="content-no-show">
                  <!-- NO SHOW USER -->
                  <p class="is-status-no-show" v-if="noShowHistory && noShowHistory.userAction !== 2"> {{ $t(`page.bookingReport.guestConfirm`) }} “{{ getUserConfirmNoShow(noShowHistory.userAction) }}”</p>
                  <p v-if="noShowHistory.userAction !== 2" class="is-time-no-show">
                    <span>{{ formatDateUI(noShowHistory?.userActionTime) }}</span>
                  </p>
                  <!-- NO SHOW HOTEL -->
                  <p class="is-status-no-show" style="padding-top:8px"> {{ $t(`page.bookingReport.hotelConfirm`) }} “{{ getHotelConfirmNoShow(noShowHistory.hotelAction) }}”</p>
                  <p class="is-time-no-show">
                    <span>{{ formatDateUI(noShowHistory?.hotelActionTime) }}</span>
                  </p>
                  <p class="is-reason-no-show">{{ $t(`page.bookingReport.reason`) }}: {{ noShowHistory.reason}}</p>
                  <span class="is-user-no-show">{{ $t(`page.bookingReport.transferBy`) }}: {{ firstBookingDetails.hotelName }}</span>
                </div>
            </div>
          </div>
          <div class="btn-action-show-hidden" @click="actionSeeMore()">
            <a  v-if="seeMore">{{ $t(`page.bookingReport.viewMore`) }}<i class="el-icon-arrow-down" /></a>
            <a  v-else>{{ $t(`page.bookingReport.viewLess`) }}<i class="el-icon-arrow-up" /></a>
          </div>
        </div>
      </div>
      <div >
        <div class="booking-history" :class="!noShowHistory && !cancelDescription ? 'height-timeline' : ''">
          <div class="timeline-history">
            <div class="timeline-history__section">
              <div v-loading="ui.isLoadingBookingStatusHistories" class="timeline-history__time-line" >
                  <h2 v-if="bookingStatusHistoryList" class="timeline-history__time-line--title">{{ $t(`page.bookingReport.trackingStatus`) }}</h2>
                  <el-timeline :class="seeMoreTimeline? 'hidden-content-timeline': 'show-content-timeline'">
                    <el-timeline-item
                      v-for="(data, index) in bookingStatusHistoryList"
                      :key="index"
                      :icon="!index ? 'circle' : ''"
                      :color="!index ? '#FF6400' : '#FAECD8'"
                      :size="!index ? 'large' : 'normal'"
                    >
                      <el-row :gutter="10">
                        <el-col :style="!index ? 'margin-top: unset;' : ''" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                          <b>{{ setBookingStatus(data) }}</b>
                          <p class="text-grey">{{ formatDateUI(data.createTime) }}</p>
                          <p>{{ setReason(data) }}</p>
                          <p>{{ setPerformer(data) }}</p>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                          <div v-if="!index" class="timeline-history__time-line--button">
                            <el-button
                              v-if="isShowCancelButton(data)"
                              type="primary"
                              plain
                              size="small"
                              @click="onCancelBooking(firstBookingDetails)">
                              {{ $t('button.cancelRoom') }}
                            </el-button>
                            <el-button
                              v-if="isShowNoShowButton(data)"
                              type="primary"
                              plain
                              size="small"
                              @click="onNoshowBooking(firstBookingDetails)"
                            >
                              {{ $t('button.noShow') }}
                            </el-button>
                            <el-button
                              :disabled="data.isTransferred"
                              v-show="isShowTransferButton(data)"
                              type="primary"
                              plain
                              size="small"
                              @click="onDirectTransfer(firstBookingDetails)">
                              {{ $t('button.transfer') }}
                            </el-button>
                            <el-button
                              v-if="isShowCompleteButton(data)"
                              type="primary"
                              plain
                              size="small"
                              @click="onCompleteBooking(firstBookingDetails)"
                            >
                              {{ $t('button.completed') }}
                            </el-button>
                            <el-button
                              v-if="isShowRefundButton(data)"
                              type="warning"
                              plain
                              size="small"
                              @click="onRefundBooking(firstBookingDetails)">
                              {{ $t('button.refund') }}
                            </el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-timeline-item>
                  </el-timeline>
                  <div class="btn-action-show-hidden-timeline" @click="actionSeeMoreTimeline()">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><hr class="hr-booking-detail"/></el-col>
                  <a  v-if="seeMoreTimeline">{{ $t(`page.bookingReport.viewMore`) }}<i class="el-icon-arrow-down" /></a>
                  <a  v-else>{{ $t(`page.bookingReport.viewLess`) }} <i class="el-icon-arrow-up" /></a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- BOOKING TRANSFER -->
    <div class="section-transfer" v-if="firstBookingDetails.isTransferred">
      <div class="section-transfer__bg">
        <div class="content-transfer">
          <p class="is-status-transfer"> {{ $t(`page.bookingReport.transferred`) }}</p>
          <p class="is-time-transfer"> {{ formatDateUI(firstBookingDetails.transferTime)}} <span class="is-user-transfer">{{ $t(`page.bookingReport.transferBy`) }}: {{ firstBookingDetails.staffTransferName}}</span></p>
          <div class="is-reason-transfer">{{ $t(`page.bookingReport.reason`) }}: <p v-html="firstBookingDetails.reasonForTransfer"></p></div>
        </div>
      </div>
    </div>

    <!-- Cancel Policy -->
    <div class="cancel-policy" v-if="cancelDescription && cancelDescription.cancellationPolicyVi">
      <div class="padding-background"></div>
      <div class="cancel-policy-section">
        <p class="is-text-title-policy">{{ $t(`page.bookingReport.cancellationPolicy`) }}</p>
        <div class="is-text-content-policy">
          <p v-if="getLocalize === 'vi'">{{ cancelDescription.cancellationPolicyVi }}</p>
          <p v-else>{{ cancelDescription.cancellationPolicyEn }}</p>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div>
      <popup-cancel ref="cancelModal" @onSuccess="getUserBookingDetails" />
      <popup-noshow ref="noshowModal" @onSuccess="getUserBookingDetails" />
      <popup-refund ref="refundModal" @onSuccess="getUserBookingDetails" />
      <popup-complete ref="completeModal" @onSuccess="getUserBookingDetails" />
      <popup-confirm-noshow ref="confirmNoshowModal" @onSuccess="getUserBookingDetails" />
    </div>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchUserBookingDetails, fetchBookingStatusHistoryList } from './api'
import { VIA_OBJECT, repStatus, PAYMENT_PROVIDER, BOOKING_STATUS, BOOKING_SOURCE } from '@/utils/const'
import PopupCancel from '../popup/cancel'
import PopupNoshow from '../popup/no-show'
import PopupRefund from '../popup/refund'
import PopupComplete from '../popup/complete'
import PopupConfirmNoshow from '../popup/confirm-no-show'

export default {
  name: 'FirstBookingDetails',
  components: {
    SaSection,
    PopupCancel,
    PopupNoshow,
    PopupRefund,
    PopupComplete,
    PopupConfirmNoshow
  },
  data: () => {
    return {
      firstBookingDetails: {},
      cancelDescription: {},
      infoTransfer: {},
      ui: {
        isLoading: false,
        isLoadingBookingStatusHistories: false,
        displayItemDetails: [
          'bookingNo',
          'userInfo',
          'roomType',
          'coupon',
          'stayAtHotelTime',
          'bookingStatus',
          'roomRate',
          'productPrice',
          'totalAmount',
          'g2jDiscount',
          'hotelDiscount',
          'userPaid',
          'paidInAdvance',
          'refund',
          'refundTime',
          'refundBy',
          'cancellationPolicy',
          'reasonForTransfering'
        ]
      },
      bookingStatusHistoryList: [],
      seeMore: true,
      seeMoreTimeline: true,
      noShowHistory: {}
    }
  },
  created () {
    this.getUserBookingDetails()
  },
  computed: {
    getLocalize () {
      return this._i18n.locale
    },
    dataG2JDiscount () {
      return [{
        name: 'Giảm giá G2J',
        nameEn: 'G2J discount',
        num: 0,
        price: this.firstBookingDetails.totalGo2JoyDiscount,
        children: [{
          name: 'Coupon',
          nameEn: 'Coupon',
          num: 0,
          price: this.firstBookingDetails.go2joyDiscount,
          promotionSn: this.firstBookingDetails.promotionSn,
          couponSn: this.firstBookingDetails?.go2joyCoupon?.couponSn,
          couponName: this.firstBookingDetails?.go2joyCoupon?.couponName
        }, {
          name: 'Giảm điểm',
          nameEn: 'Mileage point',
          num: 0,
          price: this.firstBookingDetails.mileagePoint
        }, {
          name: 'Giảm giá khác',
          nameEn: 'Other discount',
          num: 0,
          price: this.firstBookingDetails.promotionDiscount
        }
        ]
      }]
    },
    dataHotelDiscount () {
      return [{
        name: 'Khách sạn giảm giá',
        nameEn: 'Hotel discount',
        num: 0,
        price: this.firstBookingDetails.totalHotelDiscount,
        children: [{
          name: 'Coupon',
          nameEn: 'Coupon',
          num: 0,
          price: this.firstBookingDetails.hotelDiscount,
          promotionSn: this.firstBookingDetails.promotionSn,
          couponSn: this.firstBookingDetails?.hotelCoupon?.couponSn,
          couponName: this.firstBookingDetails?.hotelCoupon?.couponName
        }, {
          name: 'Giảm sốc',
          nameEn: 'Flash sale',
          num: 0,
          price: this.firstBookingDetails.fsHotelDiscount
        }, {
          name: 'Sử dụng tem',
          nameEn: 'Redeem stamp',
          num: 0,
          price: this.firstBookingDetails.redeemValue
        },
        {
          name: 'Giảm trực tiếp',
          nameEn: 'Direct discount',
          num: 0,
          price: this.firstBookingDetails.directDiscount
        }
        ]
      }]
    },
    hotelProductList () {
      return [{
        name: 'Sản phẩm đi kèm',
        nameEn: 'Bundled products',
        num: 0,
        price: this.firstBookingDetails.productValue,
        children: this.firstBookingDetails.hotelProductList
      }]
    }
  },
  methods: {
    isShowPayOnline (data) {
      return data.paymentProvider !== PAYMENT_PROVIDER.payHotel
    },
    setUserInfo (data) {
      return `${data?.appUserNickName || ''} ${data.mobile ? '/ ' + data.mobile : ''}`
    },
    setReason (data) {
      if (data?.description?.reason) return `${this.$t('page.bookingReport.reason')}: ${data?.description?.reason}`
      else if (data?.description?.refunded) return `${this.$t('option.refunded')}: ${this.formatMoney(data?.description?.refunded)} đ qua ${this.setPaymentProvider(data.paymentProvider)}`
      else return ''
    },
    setPerformer (data) {
      return data?.description?.performer ? `${this.$t('page.firstBooking.by')}: ${data?.description?.performer}` : ''
    },
    setCoupon (row) {
      if (row.discountType) {
        if (row.discountType === 2) return `${row.discount}%`
        else if (row.discountType === 5) return `${this.formatMoney(row.discount)} ${this.$t('page.bookingReport.discountType')}`
        else return ''
      } else return 'N/A'
    },
    setPaymentProvider (paymentProvider) {
      switch (paymentProvider) {
        case PAYMENT_PROVIDER.payHotel: return this.$t('payment.payHotel')
        case PAYMENT_PROVIDER.momo: return this.$t('payment.momo')
        case PAYMENT_PROVIDER.credit: return this.$t('payment.credit')
        case PAYMENT_PROVIDER.debit: return this.$t('payment.debit')
        case PAYMENT_PROVIDER.zaloWallet: return this.$t('payment.zaloWallet')
        case PAYMENT_PROVIDER.payoo: return this.$t('payment.payoo')
        case PAYMENT_PROVIDER.creditCardVnpt: return this.$t('payment.creditCardVnpt')
        case PAYMENT_PROVIDER.atmCardVnpt: return this.$t('payment.atmCardVnpt')
        case PAYMENT_PROVIDER.shopeePay: return this.$t('payment.shopeePay')
        case PAYMENT_PROVIDER.zalo: return this.$t('payment.zalo')
        default: return ''
      }
    },
    setTextCancellation (row) {
      if (row.bookingStatus === BOOKING_STATUS.waitForGo2Joy && row.source !== BOOKING_SOURCE.momo) return this.$t('page.bookingReport.requestCancelByHotel')
      else if (row.bookingStatus === null && row.source === BOOKING_SOURCE.momo) return this.$t('page.bookingReport.requestCancelByMomo')
      else return ''
    },
    async getBookingStatusHistoryList () {
      this.ui.isLoadingBookingStatusHistories = true
      try {
        const { data } = await fetchBookingStatusHistoryList(this.$route.params.sn)
        if (data?.code === repStatus.sussess) {
          this.bookingStatusHistoryList = data.data?.bookingStatusHistoryList
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingBookingStatusHistories = false
      }
    },
    async getUserBookingDetails () {
      this.ui.isLoading = true
      try {
        const { data } = await fetchUserBookingDetails(this.$route.params.sn)
        if (data?.code === repStatus.sussess) {
          this.firstBookingDetails = data.data
          this.cancelDescription = data?.data?.cancelDescription
          this.infoTransfer = data?.data?.infoTransfer
          this.noShowHistory = data?.data?.noShowHistory
          if (data?.data?.hotelProductList?.length) {
            this.initDataProduct(data?.data?.hotelProductList)
          }
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoading = false
        this.getBookingStatusHistoryList()
      }
    },
    onCancelBooking (data) {
      this.$refs.cancelModal.open(data)
    },
    onRefundBooking (data) {
      this.$refs.refundModal.open(data)
    },
    onDirectTransfer (data) {
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
    },
    actionSeeMore () {
      this.seeMore = !this.seeMore
    },
    actionSeeMoreTimeline () {
      this.seeMoreTimeline = !this.seeMoreTimeline
    },
    getUserConfirmNoShow (userAction) {
      if (!userAction && userAction !== 0) {
        return
      }
      switch (userAction) {
        case 0 :
          return this.$t('option.userConfirm.notYet')
        case 1 :
          return this.$t('option.userConfirm.Yes')
        case 2 :
          return ''
        default:
          return ''
      }
    },
    getHotelConfirmNoShow (hotelAction) {
      if (!hotelAction && hotelAction !== 0) {
        return
      }
      return this.$t('option.hotelConfirm.noShow')
    }
  }
}
</script>
<style lang="scss" scoped>
.check-device-screen {
  min-height: 162px;
  @media (max-width: 1024px) {
    min-height: auto;
  }
}
.first-booking {
    :deep([class*=el-col-]) {
    padding: 6px;
  }
  .is-refunded-info {
    display:flex;
    gap: 32px;
    @media (max-width: 540px) {
      display: block;
    }
  }
  .booking-detail {
    display: block;
    padding:4px 16px 4px 4px;
    @media (max-width: 540px) {
      padding:4px;
    }
    &__hotel-info {
      background-color: #F4F4F5;
      border-radius: 4px;
      padding: 16px;
      .is-name-hotel {
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        color: #000000;

      }
      .is-title-detail {
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #606266;
      }
      .is-data-detail {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
      }
      .is-color-go2joy {
        color: #FF6400 !important;
      }
    }
    &__booking-info {
      display: block;
      padding:8px 4px;

      .is-title-detail {
        font-weight: 600;
        font-style: normal;
        font-size: 14px;
        color: #606266;
      }
      .is-data-detail {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
        text-align: left;
        @media (max-width: 540px) {
          text-align: right;
        }
      }
      .is-color-go2joy {
        color: #FF6400 !important;
      }
      .is-title-detail-small {
        padding-left: 20px;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #606266;
        @media (max-width: 1024px) {
          padding-left: 0;
        }
      }
      .is-data-detail-small {
        font-weight: 600;
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #606266;
        color: #303133;
        text-align: left;
        @media (max-width: 540px) {
          text-align: right;
        }
      }
    }
    .btn-action-show-hidden {
      display: none;
      @media (max-width: 540px) {
        display: block;
        text-align: center;
        padding:6px 0;
        font-size: 14px;
        font-weight: 400;
        color: #409EFF;
      }
    }
    .hidden-content {
      height: 100%;
      overflow:unset;
      @media (max-width: 540px) {
        height: 60px;
        overflow:hidden;

      }

    }
    .show-content {
      height: 100%;
      overflow:unset;
      @media (max-width: 540px) {
        height: 100%;
        overflow:hidden;

      }
    }
    .hr-booking-detail {
        border-top:1px solid #DCDFE6;
        margin: 0;
    }
  }
  .cancel-policy {
    background:#f2f5fa;
    margin:-12px;
    .padding-background {
      padding:6px
    }
    .cancel-policy-section {
      background-color: #ffffff;
      padding:16px;
      .is-text-title-policy {
        font-weight: 600;
        font-size: 20px;
        color: #303133;
      }
      .is-text-content-policy {
        padding-top: 4px;
        font-weight: 400;
        font-size: 14px;
        color: #303133;
      }
    }
  }
  .height-timeline {
    height: calc(100% + 32px) !important;
  }
  .booking-history {
    background:#f2f5fa;
    margin-top:-18px;
    height: calc(100%);
    @media (max-width: 540px) {
      border-top: 8px solid #f2f5fa;
      margin:0px -12px;

    }
    .timeline-history {
      padding-left:12px;
      @media (max-width: 540px) {
        padding-left:0;
      }
      height: 100%;
      &__section {
        background-color: #ffffff;
        height: 100%;
        .timeline-history__time-line {
          padding-left: 16px;
          margin-top: 6px;
          height: 100%;
          @media (max-width: 540px) {
            padding: 0 8px;
          }
          ul {
            padding-left: 7px;
          }
          &--title {
              padding-top:16px;
              font-size: 20px;
              margin-bottom: 2vh;
              font-weight: 600;
          }
          &--button {
            button {
              margin-top: 6px;
            }
          }
        }
        .btn-action-show-hidden-timeline {
          display: none;
          @media (max-width: 540px) {
            display: block;
            text-align: center;
            padding:6px 0;
            font-size: 14px;
            font-weight: 400;
            color: #409EFF;
          }
        }
        .hr-booking-detail {
            border-top:1px solid #DCDFE6;
            margin: 0;
        }
        .hidden-content-timeline {

          @media (max-width: 540px) {
            height: 85px;
            overflow:hidden;

          }

        }
        .show-content-timeline {

          @media (max-width: 540px) {
            height: auto;
            overflow:hidden;

          }
        }
      }
    }
  }
  .hr-section-transfer {
    margin: 0 -16px;
    width: 105%;
    height:1px;
    background-image: repeating-linear-gradient(0deg, #DCDFE6, #DCDFE6 4px, transparent 4px, transparent 17px, #DCDFE6 17px), repeating-linear-gradient(90deg, #DCDFE6, #DCDFE6 4px, transparent 4px, transparent 17px, #DCDFE6 17px), repeating-linear-gradient(180deg, #DCDFE6, #DCDFE6 4px, transparent 4px, transparent 17px, #DCDFE6 17px), repeating-linear-gradient(270deg, #DCDFE6, #DCDFE6 4px, transparent 4px, transparent 17px, #DCDFE6 17px);
    background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px;
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;
  }
  .content-no-show-section {
    background:#fff;
      padding-top: 16px;
      padding-bottom: 32px;
      width: calc(100%);
      display: flex;
      @media (max-width: 540px) {
        width:calc(100% + 24px);
        margin: 0 -6px;
      }
      .is-icon-transfer {
        display: flex;
        align-items: flex-start;
        font-size: 24px;
        color: rgb(64, 158, 255);
      }
      .content-no-show {
      padding-left: 18px;
      @media (max-width: 540px) {
        padding: 0 12px;
      }

      .is-status-no-show {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
      }
      .is-time-no-show {
        padding: 4px 0;
        font-weight: 400;
        font-size: 14px;
        color: #606266;
      }
      .is-reason-no-show {
        padding-top:4px;
        font-weight: 400;
        font-size: 14px;
        color: #303133;
      }

    }
  }
  .is-reason-transfer:deep(img) {
    max-width: 250px !important;
  }
  .section-transfer {
      background:#f2f5fa;
      padding-top: 12px;
      // padding-bottom: 12px;
      margin:-12px;
      width: calc(100% + 24px);
      @media (max-width: 540px) {
        width:calc(100% + 24px);
        margin: 0 -12px;
      }
      &__bg {
        background: #fff;
      .padding-background {
        padding:6px
      }
      // padding:4px 8px;
      @media (max-width: 540px) {
        display: grid;
      }
      .content-transfer {
        padding: 12px 0 12px 20px;
        @media (max-width: 540px) {
          padding: 12px;
        }

        .is-status-transfer {
          font-weight: 600;
          font-size: 20px;
          color: #303133;
        }
        .is-time-transfer {
          padding: 4px 0;
          font-weight: 400;
          font-size: 14px;
          color: #606266;
        }
        .is-reason-transfer {
          padding-top:8px;
          font-weight: 400;
          font-size: 14px;
          color: #303133;
          padding-bottom: 12px;
        }
      }
    }
  }
  &__item {
    padding: 6px;
    border-bottom: 1px solid var(--grey-black-color);
  }
  .booking-detail-content {
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    @media (max-width: 540px) {
      grid-template-columns: 1fr
    }

  }
}
// Timeline
.line {
  border: 1px solid var(--light-color);
}
.el-tree-node__content {
  .custom-tree-node {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    @media (max-width: 1024px) {
      grid-template-columns: 2fr 2fr 1fr;
    }
    @media (max-width: 540px) {
      grid-template-columns: 3fr 2fr;
    }
    justify-content:flex-start;
    @media (max-width: 540px) {
      justify-content:space-between
    }
    p {
      width: calc(100% - 20px);
    }
    span {
      width: calc(100%);
      font-size: 14px;
      font-weight: 600 !important;
      color: #303133;
    }

    .is-price-tree {
      text-align: left;
      margin-left: -8px;
      font-weight: 600 !important;
      @media (max-width: 540px) {
        margin-left: 0;
        text-align: right;
        width: 100%;
      }
    }
  }
}
.el-tree-node__children {
  .custom-tree-node {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    position: relative;
    @media (max-width: 1024px) {
      grid-template-columns: 2fr 2fr 1fr;
    }
    @media (max-width: 540px) {
      grid-template-columns: 6fr 1fr;
    }
    justify-content:flex-start;
    @media (max-width: 540px) {
      justify-content:space-between;
    }
    .style-dot {
      font-size: 14px;
      font-weight: 400;
    }
    .style-coupon {
      padding-left:12px;
      display: inline-flex;
      @media (max-width: 540px) {
        display: unset;
      }
    }
    .style-dot a{
      margin-left: -10px;
      @media (max-width: 540px) {
        width: 100%;
      }
    }
    padding-left: 12px;
    padding-top: 6px;
    p {
      display: grid;
      grid-template-columns: 3fr 1fr;
      @media (max-width: 540px) {
        grid-template-columns: 4fr 1fr;
      }
    }
    .is-limit-text {
      font-weight: 400 !important;
      font-size: 14px;
      width: calc(100% );
      color: #606266;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .is-price-tree {
        text-align: left;
        margin-left: -18px;
        font-weight: 400 !important;
        @media (max-width: 540px) {
          margin-left: 0;
          text-align: right;
        }

      }
  }

}
.first-booking :deep(.el-tree-node__content) {
    @media (max-width: 540px) {
      margin: 10px 0;
    }
  }
.first-booking :deep(.el-tree-node__content>.el-tree-node__expand-icon){
  color: #000000;
  padding:0;
  font-size: 16px;
  margin-right: 2px;
}
.first-booking :deep(.el-tree-node__children .el-tree-node__content>.el-tree-node__expand-icon){
  display: none;
}
.first-booking .display-none-icon:deep(.el-icon-caret-right) {
  display: none;
}
.first-booking .display-none-icon:deep(.is-price-tree) {
  padding-left: 12px;
}
.first-booking :deep(.el-tree-node__content:hover) {
  background: none;
}

:deep(.el-timeline-item) {
    padding-bottom: 2px;
}
:deep(.el-timeline-item__content) {
  .el-col {
    padding: 4px 0;
    margin-top: -6px;
  }
}
:deep(.el-timeline-item__node--large) {
  position: absolute;
  width: 24px;
  height: 24px;
  left: -6px;
  background: var(--antique-white-color) !important;
}
:deep(.el-timeline-item__icon) {
  border: 1px solid var(--orange-color);
  border-radius: 50%;
  background-color: var(--orange-color);
  width: 12px;
  height: 12px;
}
</style>
