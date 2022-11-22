import apiCaller from '@/api/apiCaller'

const resource = '/user-bookings/reports/booking/transfer'

export async function transferBooking (data) {
  return await apiCaller.put(`${resource}`, data)
}

export async function saveTransferBooking (data) {
  return await apiCaller.put(`${resource}/sendRequest`, data)
}
