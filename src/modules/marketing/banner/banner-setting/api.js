import apiCaller from '@/api/apiCaller'

async function fetchBannerSettingDisplays (params) {
  return await apiCaller.get('banners/setting/display', { params: params })
}

async function updateBannerSettingDisplay (params) {
  return await apiCaller.post('banners/setting/display?_method=PUT', params)
}

async function multipleIdx (data) {
  return await apiCaller.post(`${process.env.VUE_APP_HOST}v2/web/sa/banners/swap/multipleIdx`, data)
}

export {
  fetchBannerSettingDisplays,
  updateBannerSettingDisplay,
  multipleIdx
}
