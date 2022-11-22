import apiCaller from '@/api/apiCaller'

export async function confirmNoShowBooking (bookingNo, params) {
  return await apiCaller.post(`/user-bookings/reports/booking/noShow/${bookingNo}?_method=PUT`, params)
}
