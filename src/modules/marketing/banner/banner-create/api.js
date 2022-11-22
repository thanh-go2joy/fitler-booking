import apiCaller from '@/api/apiCaller'

async function createBanner (data) {
  return apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/banners`, data)
}

export {
  createBanner
}
