import apiCaller from '@/api/apiCaller'

export async function addCollection (params) {
  return await apiCaller.get(`${process.env.VUE_APP_HOST}v2/web/sa/hotel-collections`, params)
}
