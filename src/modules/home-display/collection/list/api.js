import apiCaller from '@/api/apiCaller'

export async function fetchHomeCollections (params) {
  return await apiCaller.get('/hotel-collections', { params: params })
}

export async function sortHotelCollection (query = '') {
  return await apiCaller.post(`/homeDisplayMgt/updateIdxHotelCollection?${query}`)
}

export async function multipleIdx (data) {
  return await apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/hotel-collections/swap/multipleIdx`, data)
}
