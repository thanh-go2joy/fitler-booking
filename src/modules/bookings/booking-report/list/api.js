import apiCaller from '@/api/apiCaller'

const resource = '/user-bookings/reports'

export async function fetchBookingReports (params) {
  return await apiCaller.get(`${resource}`, { params: params })
}
export async function exportBookingReports (params) {
  return await apiCaller.get('/exports/user-bookings', { params: params })
}
export async function statisticsUserBookingReports (params) {
  return await apiCaller.get(`${resource}/statistics`, { params: params })
}
