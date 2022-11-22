import apiCaller from '@/api/apiCaller'

export async function getHomeCategoryDetails (id) {
  return await apiCaller.get(`home-categories/${id}`)
}

export async function updateHomeCategory (payload) {
  return await apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/home-categories/${payload.sn}?_method=PUT`, payload)
}
