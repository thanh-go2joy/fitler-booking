import apiCaller from '@/api/apiCaller'

export async function getBookingCancelReason () {
  // return await apiCaller.get('/user-bookings/getBookingCancelReason')

  // return await apiCaller.get('https://staging-api.go2joy.vn/api/v2/web/sa/user-bookings/getBookingCancelReason')
  return await apiCaller.get(`${process.env.VUE_APP_HOST}v2/web/sa/user-bookings/getBookingCancelReason`)
}

export async function cancelBooking (bookingNo, params) {
  return await apiCaller.post(`/user-bookings/reports/booking/cancel/${bookingNo}?_method=PUT`, params)
}
