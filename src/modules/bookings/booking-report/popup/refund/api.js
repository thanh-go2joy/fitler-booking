import apiCaller from '@/api/apiCaller'

export async function refundUserBooking (bookingNo) {
  return await apiCaller.post(`/user-bookings/reports/booking/refund/${bookingNo}?_method=PUT`)
}
