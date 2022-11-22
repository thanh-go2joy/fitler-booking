import apiCaller from '@/api/apiCaller'

export async function getCollectionDetails (sn) {
  return await apiCaller.get(`hotel-collections/${sn}`)
}

export async function updateCollectionDetails (params) {
  return await apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/hotel-collections/${params.get('sn')}`, params)
}
