import apiCaller from '@/api/apiCaller'

const resource = '/user-bookings/reports'

export async function fetchBookingDetail (params) {
  return await apiCaller.get(`${resource}/bookings`, { params: params })
}
export async function onDelete (params) {
  return await apiCaller.get(`${resource}/booking/cancel`, { params: params })
}
