import apiCaller from '@/api/apiCaller'

export async function listHotetDebt (params) {
  return await apiCaller.get('/hotel-debts', { params: params })
}
export async function onExportHotetDebt (params) {
  return await apiCaller.get('/exports/hotel-debt-detail-list', { params: params })
}

export async function onDelete (sn) {
  return await apiCaller.delete(`/hotel-debts/${sn}`)
}
