export const repStatus = {
  sussess: 1,
  failed: 2
}

export const TYPE = [
  { value: '', key: 'page.collection.allType' },
  { value: 1, key: 'page.collection.flashSale' },
  { value: 2, key: 'page.collection.promotion' },
  { value: 3, key: 'page.collection.directDiscount' },
  { value: 4, key: 'page.collection.amenityPackHotel' },
  { value: 5, key: 'page.collection.loveHotel' },
  { value: 6, key: 'page.collection.travelHotel' },
  { value: 7, key: 'page.collection.hotHotel' },
  { value: 8, key: 'page.collection.newHotel' },
  { value: 9, key: 'page.collection.stamp' },
  { value: 10, key: 'page.collection.image360' },
  { value: 11, key: 'page.collection.hotelReview' },
  { value: 12, key: 'page.collection.hotSearched' },
  { value: 13, key: 'page.collection.hotelBooked' },
  { value: 14, key: 'page.collection.hotelFavorite' },
  { value: 15, key: 'page.collection.hotelSuggestion' },
  { value: 16, key: 'page.collection.g2jCertified' },
  { value: 17, key: 'page.collection.quarantine' }
]

export const TRANSACTION_STATUS = {
  completed: 1,
  cancelled: 2,
  noShow: 3
}

export const TRANSACTION_TYPE = {
  origin: 1,
  transfer: 2
}

export const BOOKING_ORIGIN = {
  hotel: 1,
  agoda: 2
}

export const BOOKING_SOURCE = {
  go2joy: 0,
  agoda: 2,
  momo: 28
}

export const BOOKING_DEVICE = {
  allDevice: 0,
  app: 1,
  web: 2
}

export const BOOKING_TYPE = {
  hours: 1,
  overnight: 2,
  daily: 3
}

export const PAYMENT_STATUS = {
  unpaidFirst: 0,
  unpaidSecond: 2,
  paid: 1,
  refunded: 3
}

export const PAYMENT_PROVIDER = {
  payHotel: 0,
  momo: 3,
  credit: 10,
  debit: 11,
  zaloWallet: 12,
  payoo: 20,
  creditCardVnpt: 41,
  atmCardVnpt: 42,
  shopeePay: 50,
  zalo: 60
}

export const VIA_OBJECT = {
  uFirst: 0,
  uSecond: 1,
  h: 2,
  hSecond: 4,
  g: 3,
  p: 6,
  s: 7,
  a: ''
}

export const BOOKING_STATUS = {
  upComing: 1,
  complete: 2,
  cancelledFirst: 0,
  cancelledSecond: 3,
  noShow: 4,
  awaitingPay: 5,
  awaitingConfirm: 6,
  init: 7,
  waitForGo2Joy: 8,
  checkedIn: 9
}

export const TARGET_TYPE_V2 = {
  NOTICE: 1,
  PROMOTION: 2,
  SERVICE_AGREEMENT: 3,
  HOTEL: 4,
  FAQ: 5,
  INVITE_FRIEND: 6,
  OPEN_APP: 7,
  MILEAGE_POINT: 8,
  DIRECT_DISCOUNT: 9,
  SIGN_UP: 10,
  PROMOTION_GROUP: 11,
  AMENITY_PACK: 12,
  HOTEL_GO2CHOICE: 13,
  HOTEL_TET: 105,
  REFERRAL: 106
}

export const STATUS_OPTIONS = [
  { value: 3, key: 'option.contracted' },
  { value: 4, key: 'option.trial' },
  { value: 5, key: 'option.terminated' },
  { value: 6, key: 'option.suspended' }
]

export const SOURCE_OPTIONS_FILTERS = [
  { value: 0, key: 'option.allSource' },
  { value: 1, key: 'option.go2joy' },
  { value: 2, key: 'option.agoda' },
  { value: 3, key: 'option.momo' }
]

export const SOURCE_OPTIONS = [
  { value: null, key: 'option.allSource' },
  { value: BOOKING_SOURCE.go2joy, key: 'option.go2joy' },
  { value: BOOKING_SOURCE.agoda, key: 'option.agoda' },
  { value: BOOKING_SOURCE.momo, key: 'option.momo' }
]

export const DEVICE_TYPE_OPTIONS = [
  { value: BOOKING_DEVICE.allDevice, key: 'option.allDevice' },
  { value: BOOKING_DEVICE.app, key: 'option.app' },
  { value: BOOKING_DEVICE.web, key: 'option.web' }
]

export const TIME_TYPE_OPTIONS = [
  { value: 1, key: 'option.checkInTime' },
  { value: 2, key: 'option.completedTime' }
]

export const STATUS_REPORT = [
  { value: 5, key: 'option.awaitingPay' },
  { value: 6, key: 'option.awaitingConfirm' },
  { value: 1, key: 'option.upComing' },
  { value: 2, key: 'option.complete' },
  { value: 8, key: 'option.waitForGo2Joy' },
  { value: 4, key: 'option.noShow' },
  { value: 3, key: 'option.cancelled' }
]

export const TYPE_REPORT = [
  { value: 1, key: 'option.hourly' },
  { value: 2, key: 'option.overnight' },
  { value: 3, key: 'option.daily' }
]

export const PAYMENT_METHOD = [
  { value: 0, key: 'option.payHotel' },
  { value: 1, key: 'option.payOnline' }
]

export const CONFIRM_BY = [
  { value: 1, key: 'option.user' },
  { value: 2, key: 'option.hotel' },
  { value: 3, key: 'option.go2joy' },
  { value: 7, key: 'option.system' }
]

export const viewOptions = [
  { value: 1, key: 'option.window' },
  { value: 2, key: 'option.balcony' },
  { value: 3, key: 'option.city' },
  { value: 4, key: 'option.garden' },
  { value: 5, key: 'option.pool' },
  { value: 6, key: 'option.noView' }
]

export const statusOptions = [
  { value: 1, key: 'option.hotelStatus.waiting' },
  { value: 2, key: 'option.hotelStatus.displayed' },
  { value: 3, key: 'option.hotelStatus.contracted' },
  { value: 4, key: 'option.hotelStatus.trial' }
]

export const statusOptionsV2 = [
  { value: 1, key: 'option.hotelStatus.waiting' },
  { value: 2, key: 'option.hotelStatus.displayed' },
  { value: 3, key: 'option.hotelStatus.contracted' },
  { value: 4, key: 'option.hotelStatus.trial' },
  { value: 5, key: 'option.hotelStatus.terminated' },
  { value: 6, key: 'option.hotelStatus.suspended' }
]

export const statusOptionsV3 = [
  { value: 0, key: 'option.status.allNoticeType' },
  { value: 1, key: 'option.status.normal' },
  { value: 2, key: 'option.status.donateCoupon' },
  { value: 3, key: 'option.status.remindCoupon' }
]

export const statusOptionsV4 = [
  { value: 0, key: 'option.status.allStatus' },
  { value: 1, key: 'option.status.draft' },
  { value: 2, key: 'option.status.created' },
  { value: 3, key: 'option.status.sending' },
  { value: 4, key: 'option.status.sent' }
]

export const targetType = [ // use Notification
  { value: 2, key: 'option.targetType.promotion' },
  { value: 105, key: 'option.targetType.hotelTet' },
  { value: 13, key: 'option.targetType.hotelGo2Choice' },
  { value: 4, key: 'option.targetType.hotel' },
  { value: 1, key: 'option.targetType.notice' },
  { value: 3, key: 'option.targetType.serviceAgreement' },
  { value: 5, key: 'option.targetType.faq' },
  { value: 6, key: 'option.targetType.inviteFriend' },
  { value: 7, key: 'option.targetType.openApp' },
  { value: 8, key: 'option.targetType.mileagePoint' },
  { value: 9, key: 'option.targetType.directDiscount' },
  { value: 10, key: 'option.targetType.signUp' },
  { value: 11, key: 'option.targetType.promotionGroup' },
  { value: 14, key: 'option.targetType.amenityPack' },
  { value: 106, key: 'option.targetType.referral' }
]

export const targetTypeV2 = [
  { value: 1, key: 'option.targetType.promotionEvent' },
  { value: 13, key: 'option.targetType.hotelGo2Choice' },
  { value: 2, key: 'option.targetType.hotel' },
  { value: 3, key: 'option.targetType.notice' },
  { value: 4, key: 'option.targetType.linkOutApp' },
  { value: 61, key: 'option.targetType.linkInApp' },
  { value: 5, key: 'option.targetType.district' },
  { value: 6, key: 'option.targetType.mileagePoint' },
  { value: 7, key: 'option.targetType.coupon' },
  { value: 8, key: 'option.targetType.directDiscount' },
  { value: 9, key: 'option.targetType.inviteFriend' },
  { value: 10, key: 'option.targetType.promotionGroup' },
  { value: 12, key: 'option.targetType.amenityPack' }
]

export const region = [
  { name: 'option.region.south', value: 1 },
  { name: 'option.region.north', value: 2 },
  { name: 'option.region.north_center', value: 4 },
  { name: 'option.region.south_center', value: 5 }
]

export const sendToOptions = [
  { value: 0, key: 'option.status.sendTo' },
  { value: 1, key: 'option.status.allUser' },
  { value: 2, key: 'option.status.go2joy' },
  { value: 3, key: 'option.status.allPartner' },
  { value: 6, key: 'option.status.allTrailPartner' },
  { value: 7, key: 'option.status.allContractPartner' },
  { value: 8, key: 'option.status.allImportFromExcelFile' },
  { value: 9, key: 'option.status.crmFilter' },
  { value: 10, key: 'option.status.userInput' }
]
export const TARGET_TYPE = {
  PROMOTION_EVENT: 1,
  HOTEL: 2,
  NOTICE: 3,
  LINK_OUT_APP: 4,
  LINK_IN_APP: 61,
  DISTRICT: 5,
  MILEAGE_POINT: 6,
  COUPON: 7,
  DIRECT_DISCOUNT: 8,
  INVITE_FRIEND: 9,
  PROMOTION_GROUP: 10,
  AMENITY_PACK: 12,
  HOTEL_GO2CHOICE: 13,
  HOTEL_TET: 105,
  MRO: 107
}
export const sendToOptionsV2 = [
  { value: 1, key: 'option.status.allUser' },
  { value: 2, key: 'option.status.go2joy' },
  { value: 3, key: 'option.status.allPartner' },
  { value: 7, key: 'option.status.allContractPartner' },
  { value: 8, key: 'option.status.allImportFromExcelFile' },
  { value: 9, key: 'option.status.crmFilter' }
]

export const contractOptions = [
  { value: 0, key: 'option.contracts.notClassified' },
  { value: 1, key: 'option.contracts.type1' },
  { value: 2, key: 'option.contracts.type2' },
  { value: 3, key: 'option.contracts.type3' },
  { value: 4, key: 'option.contracts.type4Recontracted' },
  { value: 5, key: 'option.contracts.typeGo2joyRoom' }
]

export const typeOptions = [
  { value: 0, key: 'option.hotelTypes.none' },
  { value: 1, key: 'option.hotelTypes.couples' },
  { value: 2, key: 'option.hotelTypes.travel' },
  { value: 3, key: 'option.hotelTypes.couplesAndTravel' },
  { value: 4, key: 'option.hotelTypes.quarantine' }
]

export const typeOptionsV2 = [
  { value: 0, key: 'option.hotelTypes.allTypes' },
  { value: 1, key: 'option.hotelTypes.couples' },
  { value: 2, key: 'option.hotelTypes.travel' },
  { value: 3, key: 'option.hotelTypes.couplesAndTravel' },
  { value: 4, key: 'option.hotelTypes.quarantine' }
]

export const roomTypes = [
  { value: -1, key: 'option.all_rooms' },
  { value: 1, key: 'option.room_available' },
  { value: 0, key: 'option.room_unavailable' }
]

export const routerView = {
  render: function (createElement) {
    return createElement(
      'router-view'
    )
  }
}
