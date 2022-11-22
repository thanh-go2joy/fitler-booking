import apiCaller from '@/api/apiCaller'

async function updateBanner (sn, data) {
  return apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/banners/${sn}?_method=PUT`, data)
}

export {
  updateBanner
}
