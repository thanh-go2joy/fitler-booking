import apiCaller from '@/api/apiCaller'

export async function confirmNoShowBooking (bookingNo) {
  return await apiCaller.post(`/user-bookings/reports/booking/confirmRequestNoShowBooking/${bookingNo}?_method=PUT`)
}
