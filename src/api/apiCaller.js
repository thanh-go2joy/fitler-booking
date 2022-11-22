import axios from 'axios'
import { getLocalStorageWithExpiry } from '@/utils/localStorage'
import Vue from 'vue'
import { Message } from 'element-ui'
import { i18n } from '../plugins'

Vue.prototype.$message = Message

const apiCaller = axios.create({
  baseURL: process.env.VUE_APP_API_DOMAIN,
  // timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
// req
apiCaller.interceptors.request.use(function (config) {
  const token = getLocalStorageWithExpiry('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers.Localization = i18n._vm.locale
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// res
apiCaller.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.data?.code === 3) {
    forceLogOut()
    return false
  } else if (error.response.status === 401) {
    Vue.prototype.$alert(i18n.t('expiredToken'))
      .then((res) => {
        forceLogOut()
      })
      .catch(() => { forceLogOut() })
    return false
  }

  if (error.response.data?.code !== 17) {
    Vue.prototype.$message({
      type: 'error',
      message: error.response.data.error ? error.response.data.error[0].message : (typeof error.response.data.message === 'object' ? error?.response?.data?.message[0]?.message.toString() : error.response.data.message.toString())
    })
  }
  return error.response
})
async function forceLogOut () {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  window.location.href = 'sign-in'
}
export default apiCaller
