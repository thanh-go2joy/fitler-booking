import Vue from 'vue'
import { BOOKING_STATUS, VIA_OBJECT, PAYMENT_STATUS, PAYMENT_PROVIDER, BOOKING_TYPE, BOOKING_DEVICE, BOOKING_ORIGIN, BOOKING_SOURCE } from '@/utils/const'

Vue.mixin({
  data () {
    return {
    }
  },
  methods: {
    formatImage (path) {
      return process.env.VUE_APP_IMAGES_URL + path
    },
    exportExel (path) {
      return process.env.VUE_APP_EXPORT_URL + path
    },
    getCookie (cname) {
      const name = cname + '='
      const decodedCookie = decodeURIComponent(document.cookie)
      const ca = decodedCookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    defaultFormatter (value, empty = true) {
      if (empty !== true) {
        return value !== null ? value : 'N/A'
      } else {
        return value !== null && value !== '' ? value : 'N/A'
      }
    },
    formatMoney (value, option = { format: 'it-IT', currency: 'VND' }) {
      return value ? value.toLocaleString(option.format, { style: 'decimal', currency: option.currency }) : '0'
    },
    formatMoneyUI (value, option = { format: 'it-IT', currency: 'VND' }) {
      return value ? `${value.toLocaleString(option.format, { style: 'decimal', currency: option.currency })} đ` : '0 đ'
    },
    // Ex: 16:00:00, 16:00, 16h00p00s, 16h00m00s
    // reg need upgrade
    formatTimeByString (time) {
      if (time == null) {
        return ''
      }
      const reg = /[:|h]/
      const convertTime = String(time)
      switch (convertTime.match(reg)[0]) {
        case ':':
          if (convertTime.split(reg).length === 3) { return this.formatTime(convertTime) }
          return convertTime
        default:
          throw this.$message({
            type: 'error',
            message: 'Format Not Found'
          })
      }
    },
    formatTime (time) {
      if (time) {
        const dateObj = new Date('2011-04-20T' + time + '.01')
        let hour = dateObj.getHours()
        let min = dateObj.getMinutes()
        if (hour < 10) {
          hour = '0' + hour
        }
        if (min < 10) {
          min = '0' + min
        }
        return hour + ':' + min
      }
    },
    formatDatePlusOne (date) {
      const oneDate = 24 * 3600 * 1000
      const timestamp = new Date(date).getTime() + oneDate
      const todate = new Date(timestamp).getDate()
      const tomonth = new Date(timestamp).getMonth() + 1
      const toyear = new Date(timestamp).getFullYear()
      return `${toyear}-${tomonth}-${todate}`
    },
    getAfterBeforeDate (date, time = true, isBefore = false) {
      if (date) {
        const dateObj = new Date(date)
        let month = dateObj.getMonth() + 1
        let day = isBefore === false ? String(dateObj.getDate() - 1).padStart(2, '0') : String(dateObj.getDate() + 1).padStart(2, '0')
        const year = dateObj.getFullYear()
        if (day === '00') {
          const today = new Date()
          month = month - 1
          day = String(new Date(today.getFullYear(), month, 0).getDate()).padStart(2, '0')
        }
        if (month < 10) {
          month = '0' + month
        }
        if (time !== true) {
          return year + '-' + month + '-' + day
        } else {
          let hour = dateObj.getHours()
          let min = dateObj.getMinutes()
          if (hour < 10) {
            hour = '0' + hour
          }
          if (min < 10) {
            min = '0' + min
          }
          return year + '-' + month + '-' + day + ' ' + hour + ':' + min
        }
      }
    },
    formatTimeByDate (time) {
      if (time) {
        const dateObj = new Date(time)
        let hour = dateObj.getHours()
        let min = dateObj.getMinutes()
        if (hour < 10) {
          hour = '0' + hour
        }
        if (min < 10) {
          min = '0' + min
        }
        return hour + ':' + min
      }
    },
    getPassDate (date, time = true) {
      if (date) {
        const dateObj = new Date(date)
        let month = dateObj.getMonth() + 1
        let day = String(dateObj.getDate() - 1).padStart(2, '0')
        const year = dateObj.getFullYear()
        if (day === '00') {
          const today = new Date()
          month = month - 1
          day = String(new Date(today.getFullYear(), month, 0).getDate()).padStart(2, '0')
        }
        if (month < 10) {
          month = '0' + month
        }
        if (time !== true) {
          return new Date(year + '-' + month + '-' + day)
        } else {
          let hour = dateObj.getHours()
          let min = dateObj.getMinutes()
          if (hour < 10) {
            hour = '0' + hour
          }
          if (min < 10) {
            min = '0' + min
          }
          return new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + min)
        }
      }
    },
    formatDate (date, time = true) {
      if (date && date !== ' ') {
        let dateObj = new Date()
        if (typeof date !== 'object') { // format date for safari
          date = date.replace(/-/g, '/')
          dateObj = new Date(date)
        } else {
          dateObj = date
        }
        let month = dateObj.getMonth() + 1
        const day = String(dateObj.getDate()).padStart(2, '0')
        const year = dateObj.getFullYear()
        if (month < 10) {
          month = '0' + month
        }
        if (time !== true) {
          return year + '-' + month + '-' + day
        } else {
          let hour = dateObj.getHours()
          let min = dateObj.getMinutes()
          if (hour < 10) {
            hour = '0' + hour
          }
          if (min < 10) {
            min = '0' + min
          }
          return year + '-' + month + '-' + day + ' ' + hour + ':' + min
        }
      } else {
        return ' '
      }
    },

    formatDateUI (date, time = true) {
      if (!date) {
        return ''
      }
      let dateObj
      if (typeof date !== 'object') {
        date = date.replace(/-/g, '/')
        dateObj = new Date(date)
      } else {
        dateObj = date
      }
      let month = String(dateObj.getMonth() + 1)
      const day = String(dateObj.getDate()).padStart(2, '0')
      const year = String(dateObj.getFullYear())
      if (Number(month) < 10) {
        month = `0${month}`
      }
      if (time) {
        let hour = String(dateObj.getHours())
        let min = String(dateObj.getMinutes())
        if (Number(hour) < 10) {
          hour = `0${hour}`
        }
        if (Number(min) < 10) {
          min = `0${min}`
        }
        return `${hour}:${min}, ${day}/${month}/${year}`
      }
      return `${day}/${month}/${year}`
    },

    setLocalStorageWithExpiry (key, value, ttl) {
      const now = new Date()

      // `item` is an object which contains the original value
      // as well as the time when it's supposed to expire
      const item = {
        value: value,
        expiry: now.getTime() + ttl
      }
      localStorage.setItem(key, JSON.stringify(item))
    },

    getLocalStorageWithExpiry (key) {
      const itemStr = localStorage.getItem(key)

      // if the item doesn't exist, return null
      if (!itemStr) {
        return null
      }

      const item = JSON.parse(itemStr)
      const now = new Date()

      // compare the expiry time of the item with the current time
      if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
      }
      return item.value
    },

    // check hotel group or hotel single
    checkIsHotelGroup () {
      const itemStr = localStorage.getItem('profile')
      const item = JSON.parse(itemStr)
      const profile = item.value
      const roleSn = profile.roleSn
      const hotelGroupSn = profile.hotelGroupSn
      return roleSn === 4 && hotelGroupSn != null
    },

    hasPermission (page, action) {
      const itemStr = localStorage.getItem('profile')
      const item = JSON.parse(itemStr)
      const profile = item.value
      const permissions = profile.permissions
      let hasPermission = 0
      if (permissions[page]) {
        hasPermission = permissions[page][action] ?? 0
      }
      return hasPermission
    },
    checkPermissionMenu (page) {
      const itemStr = localStorage.getItem('profile')
      const item = JSON.parse(itemStr)
      const profile = item.value
      const permissions = profile.permissions
      let hasPermission = 1
      if (permissions[page]) {
        hasPermission = permissions[page].pView ?? 0
        if (hasPermission === 1) {
          return false
        } else {
          return true
        }
      }
    },
    hasRoleSn () {
      const itemStr = localStorage.getItem('profile')
      const item = JSON.parse(itemStr)
      const profile = item.value
      const hasRoleSn = profile.roleSn
      return hasRoleSn
    },
    forceLogout () {
      localStorage.removeItem('access_token')
      localStorage.removeItem('profile')
      localStorage.removeItem('isPopupVisible')
      window.location.href = 'sign-in'
    },

    groupBy (data, key) {
      return data.reduce(function (r, a) {
        r[a[key]] = r[a[key]] || []
        r[a[key]].push(a)
        return r
      }, Object.create(null))
    },
    formatEvenPrice (price) {
      return Math.round(price / 1000) * 1000
    },
    formatEvenPercent (value) {
      return Math.round(value)
    },

    // ==================== STATUS BOOKING ====================
    isAwaitingPay (row) {
      return row.bookingStatus === BOOKING_STATUS.awaitingPay
    },
    isAwaitingConfirm (row) {
      return row.bookingStatus === BOOKING_STATUS.awaitingConfirm
    },
    isUpComing (row) {
      return row.bookingStatus === BOOKING_STATUS.upComing
    },
    isCheckedIn_H (row) {
      return row.bookingStatus === BOOKING_STATUS.checkedIn && row.viaObject === VIA_OBJECT.h
    },
    isCheckedIn_A (row) {
      return row.origin === BOOKING_ORIGIN.agoda && row.bookingStatus === BOOKING_STATUS.checkedIn && row.viaObject === VIA_OBJECT.a
    },
    isCheckedIn_U (row) {
      return row.bookingStatus === BOOKING_STATUS.checkedIn && (row.viaObject === VIA_OBJECT.uFirst || row.viaObject === VIA_OBJECT.uSecond)
    },
    isCheckedIn_G (row) {
      return row.bookingStatus === BOOKING_STATUS.checkedIn && row.viaObject === VIA_OBJECT.g
    },
    // --------------------- ĐÃ HỦY ----------------
    isCancelled (row) {
      return row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond
    },
    isCancelled_G (row) {
      return !!(((row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && row.viaObject === VIA_OBJECT.g))
    },
    isCancelled_H (row) {
      // return !!(((row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && row.viaObject === VIA_OBJECT.h))
      return (row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && (row.viaObject === VIA_OBJECT.h || row.viaObject === VIA_OBJECT.hSecond)
    },
    isCancelled_U (row) {
      return !!(((row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && (row.viaObject === VIA_OBJECT.uFirst || row.viaObject === VIA_OBJECT.uSecond)))
    },
    isCancelled_A (row) {
      return !!(row.origin === BOOKING_ORIGIN.agoda && (row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond))
    },
    isCancelled_P (row) {
      return !!(((row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && row.viaObject === VIA_OBJECT.p && row.source === BOOKING_SOURCE.momo))
    },
    isCancelled_S (row) {
      return !!(((row.bookingStatus === BOOKING_STATUS.cancelledFirst || row.bookingStatus === BOOKING_STATUS.cancelledSecond) && row.viaObject === VIA_OBJECT.s))
    },
    // --------------------- KHÔNG NHẬN PHÒNG ----------------
    isNoshow (row) {
      return row.bookingStatus === BOOKING_STATUS.noShow
    },
    // --------------------- CHỜ G2J XỬ LÝ ----------------
    isAwaitingGo2JoyProcessing (row) {
      return row.bookingStatus === BOOKING_STATUS.waitForGo2Joy
    },
    // --------------------- HOÀN THÀNH ----------------
    isComplete (row) {
      return row.bookingStatus === BOOKING_STATUS.complete
    },
    isComplete_H (row) {
      return !!(row.bookingStatus === BOOKING_STATUS.complete && row.viaObject === VIA_OBJECT.h)
    },
    isComplete_A (row) {
      return !!(row.origin === BOOKING_ORIGIN.agoda && row.bookingStatus === BOOKING_STATUS.complete && row.viaObject === VIA_OBJECT.a)
    },
    isComplete_U (row) {
      return !!((row.bookingStatus === BOOKING_STATUS.complete && (row.viaObject === VIA_OBJECT.uFirst || row.viaObject === VIA_OBJECT.uSecond)))
    },
    isComplete_G (row) {
      return !!(row.bookingStatus === BOOKING_STATUS.complete && row.viaObject === VIA_OBJECT.g)
    },
    isComplete_S (row) {
      return !!(row.bookingStatus === BOOKING_STATUS.complete && row.viaObject === VIA_OBJECT.s)
    },
    // --------------------- KHỞI TẠO ----------------
    isInit (row) {
      return row.bookingStatus === BOOKING_STATUS.init
    },
    // ==================== STATUS PAYMENT ====================
    isUnpaid (row) {
      if (row.paymentStatus === PAYMENT_STATUS.unpaidFirst || row.paymentStatus === PAYMENT_STATUS.unpaidSecond) return true
      return false
    },
    isPaid (row) {
      return row.paymentStatus === PAYMENT_STATUS.paid
    },
    // ==================== METHOD PROVIDER ====================
    isPayAtHotel (row) {
      return row.paymentProvider === PAYMENT_PROVIDER.payHotel
    },
    isPayOnline (row) {
      return row.paymentProvider !== PAYMENT_PROVIDER.payHotel
    },
    // ==================== BOOKING TYPE ====================
    setBookingType (type) {
      switch (type) {
        case BOOKING_TYPE.hours: return this.$t('option.hourly')
        case BOOKING_TYPE.overnight: return this.$t('option.overnight')
        case BOOKING_TYPE.daily: return this.$t('option.daily')
        default: return ''
      }
    },
    setReasonBookingStatus (row) {
      if (!row.reasonForTransfer) {
        if (row.reasonForCancellation) return row.reasonForCancellation
        else if (row.reasonForNoShow) return row.reasonForNoShow
        else if (row.reasonForComplete) return row.reasonForComplete
        else return ''
      } else return this.$t('page.bookingReport.changedByBookingTransfer')
    },
    setTextCancellation (row) {
      if ((this.isComplete(row) || this.isUpComing(row)) && row.source === BOOKING_SOURCE.momo && row.reasonForCancellation) return this.$t('page.bookingReport.requestCancelByMomo')
      else return ''
    },
    // ==================== BOOKING STATUS ====================
    setBookingStatus (row) {
      if (this.isAwaitingPay(row)) return this.$t('option.awaitingPay')
      else if (this.isAwaitingConfirm(row)) return this.$t('option.awaitingConfirm')
      else if (this.isUpComing(row)) return this.$t('option.upComing')
      else if (this.isCheckedIn_H(row)) return `${this.$t('option.checkedIn')} (H)`
      else if (this.isCheckedIn_A(row)) return `${this.$t('option.checkedIn')} (A)`
      else if (this.isCheckedIn_U(row)) return `${this.$t('option.checkedIn')} (U)`
      else if (this.isCheckedIn_G(row)) return `${this.$t('option.checkedIn')} (G)`
      else if (this.isCancelled_G(row)) return `${this.$t('option.cancelled')} (G)`
      else if (this.isCancelled_H(row)) return `${this.$t('option.cancelled')} (H)`
      else if (this.isCancelled_U(row)) return `${this.$t('option.cancelled')} (U)`
      else if (this.isCancelled_A(row)) return `${this.$t('option.cancelled')} (A)`
      else if (this.isCancelled_P(row)) return `${this.$t('option.cancelled')} (P)`
      else if (this.isCancelled_S(row)) return `${this.$t('option.cancelled')} (S)`
      else if (this.isNoshow(row)) return this.$t('option.noShow')
      else if (this.isAwaitingGo2JoyProcessing(row)) return this.$t('option.waitForGo2Joy')
      else if (this.isComplete_H(row)) return `${this.$t('option.complete')} (H)`
      else if (this.isComplete_A(row)) return `${this.$t('option.complete')} (A)`
      else if (this.isComplete_U(row)) return `${this.$t('option.complete')} (U)`
      else if (this.isComplete_G(row)) return `${this.$t('option.complete')} (G)`
      else if (this.isComplete_S(row)) return `${this.$t('option.complete')} (S)`
      else if (this.isInit(row)) return this.$t('option.init')
      else return ''
    },
    // ==================== PAYMENT STATUS ====================
    setPaymentStatus (paymentStatus) {
      switch (paymentStatus) {
        case PAYMENT_STATUS.unpaidFirst:
        case PAYMENT_STATUS.unpaidSecond: return this.$t('option.unpaid')
        case PAYMENT_STATUS.paid: return this.$t('option.paid')
        case PAYMENT_STATUS.refunded: return this.$t('option.refunded')
        default: return ''
      }
    },
    // ==================== PAYMENT PROVIDER ====================
    setPaymentProvider (paymentProvider) {
      switch (paymentProvider) {
        case PAYMENT_PROVIDER.payHotel: return `(${this.$t('payment.payHotel')})`
        case PAYMENT_PROVIDER.momo: return `(${this.$t('payment.momo')})`
        case PAYMENT_PROVIDER.credit: return `(${this.$t('payment.credit')})`
        case PAYMENT_PROVIDER.debit: return `(${this.$t('payment.debit')})`
        case PAYMENT_PROVIDER.zaloWallet: return `(${this.$t('payment.zaloWallet')})`
        case PAYMENT_PROVIDER.payoo: return `(${this.$t('payment.payoo')})`
        case PAYMENT_PROVIDER.creditCardVnpt: return `(${this.$t('payment.creditCardVnpt')})`
        case PAYMENT_PROVIDER.atmCardVnpt: return `(${this.$t('payment.atmCardVnpt')})`
        case PAYMENT_PROVIDER.shopeePay: return `(${this.$t('payment.shopeePay')})`
        case PAYMENT_PROVIDER.zalo: return `(${this.$t('payment.zalo')})`
        default: return ''
      }
    },
    // ==================== DEVICE TYPE ====================
    setDeviceType (deviceType) {
      switch (deviceType) {
        case BOOKING_DEVICE.allDevice: return this.$t('option.allDevice')
        case BOOKING_DEVICE.app: return this.$t('option.app')
        case BOOKING_DEVICE.web: return this.$t('option.web')
        default: return ''
      }
    },
    // ==================== CLASS BOOKING STATUS ====================
    setClassBookingStatus (row) {
      return row.bookingStatus === BOOKING_STATUS.upComing ||
      row.bookingStatus === BOOKING_STATUS.complete ||
      row.bookingStatus === BOOKING_STATUS.awaitingPay ||
      row.bookingStatus === BOOKING_STATUS.awaitingConfirm ? 'bg-success' : 'bg-danger'
    },
    // ==================== CONDITION SHOW BUTTON ====================
    isShowCancelButton (row) {
      if (!this.hasPermission('sabooking', 'pModify')) {
        return false
      }
      // agoda => Không có nút hủy phòng
      if (row.origin === BOOKING_ORIGIN.agoda) {
        return false
      }
      // hotel
      if (this.isPayOnline(row)) {
        if (this.isUnpaid(row)) {
          return false
        }
        if (this.isUpComing(row) ||
        this.isAwaitingGo2JoyProcessing(row)) return true
        else return false
      } else if (this.isPayAtHotel(row)) {
        if (this.isUnpaid(row)) {
          if (this.isUpComing(row) || this.isAwaitingGo2JoyProcessing(row)) return true
          else return false
        } return false
      } else return false
    },
    isShowCompleteButton (row) {
      // if (!this.hasPermission('sabooking', 'pModify')) {
      //   return false
      // }

      // agoda
      if (row.origin === BOOKING_ORIGIN.agoda) {
        return false
      }
      // hotel
      if (this.isPayOnline(row)) {
        if (this.isPaid(row)) {
          if (this.isAwaitingGo2JoyProcessing(row)) return true
          else return false
        }
      } else if (this.isPayAtHotel(row)) {
        if (this.isUnpaid(row)) {
          if (this.isAwaitingGo2JoyProcessing(row)) return true
          else return false
        }
      } else return false
    },
    isShowTransferButton (row) {
      if (!this.hasPermission('sabooking', 'pModify') || !this.hasPermission('sabooking', 'pSpecial')) {
        return false
      }

      // App cũ => Điều kiện đã được gộp vào trả trước & tại ks của hotel (K phải agoda)
      // agoda
      if (row.origin === BOOKING_ORIGIN.agoda) {
        return false
      }
      // hotel
      if (this.isComplete_U(row) || this.isComplete_G(row) || this.isComplete_H(row)) {
        return true
      }

      if (this.isPayOnline(row)) {
        if (this.isPaid(row)) {
          if (this.isNoshow(row) ||
          this.isComplete_S(row) ||
          this.isComplete_G(row) ||
          this.isCancelled_U(row) ||
          this.isCancelled_S(row) ||
          this.isCancelled_G(row)) return true
          else return false
        } else if (this.isUnpaid(row)) {
          if (this.isAwaitingPay(row) || this.isCancelled_U(row) || this.isCancelled_S(row)) return true
          else return false
        }
      } else if (this.isPayAtHotel(row)) {
        if (this.isPaid(row)) {
          if (this.isComplete_G(row) || this.isComplete_S(row) || this.isCancelled_S(row)) return true
          else return false
        } else if (this.isUnpaid(row)) {
          if (this.isNoshow(row) ||
          this.isCancelled_U(row) ||
          this.isCancelled_H(row) ||
          this.isCancelled_G(row)) return true
          else return false
        }
      } else return false
    },
    isShowNoShowButton (row) {
      // if (!this.hasPermission('sabooking', 'pModify')) {
      //   return false
      // }

      // agoda
      if (row.origin === BOOKING_ORIGIN.agoda) {
        return false
      }
      // hotel
      if (this.isPayOnline(row)) {
        if (this.isPaid(row)) {
          if (this.isAwaitingGo2JoyProcessing(row) || this.isUpComing(row)) return true
          else return false
        }
      } else if (this.isPayAtHotel(row)) {
        if (this.isUnpaid(row)) {
          if (this.isAwaitingGo2JoyProcessing(row) || this.isUpComing(row)) return true
          else return false
        }
      } else return false
    },
    isShowRefundButton (row) {
      if (!this.hasPermission('sabooking', 'pModify')) {
        return false
      }

      // agoda
      if (row.origin === BOOKING_ORIGIN.agoda) {
        if (this.isPaid(row)) {
          if (this.isCancelled_A(row) ||
          this.isCancelled_U(row) ||
          this.isCancelled_G(row)) return true
          else return false
        }
      }
      // hotel
      if (this.isPayOnline(row)) {
        if (this.isPaid(row)) {
          if (this.isCancelled_U(row) || this.isCancelled_G(row) || this.isCancelled_S(row)) return true
          else return false
        }
        return false
      } else return false
    },
    // ========================== VALIDATION SHOW ERROR ===========================
    validateRequied (rule, value, callback) {
      if (value.trimStart().length === 0) {
        callback(new Error(this.$t('validation.required')))
      } else {
        callback()
      }
    }
  }
})
