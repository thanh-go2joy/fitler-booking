import apiCaller from '@/api/apiCaller'

const resource = '/user-bookings/reports'

export async function fetchUserBookingHotels (params) {
  return await apiCaller.get(`${resource}/hotels`, { params: params })
}
// export async function refundUserBooking (sn) {
//   return await apiCaller.post(`${resource}/booking/refund/${sn}?_method=PUT`)
// }

// export async function confirmUserBooking (sn) {
//   return await apiCaller.post(`${resource}/booking/confirm/${sn}?_method=PUT`)
// }

// export async function cancelUserBooking (sn) {
//   return await apiCaller.post(`${resource}/booking/cancel/${sn}?_method=PUT`)
// }
