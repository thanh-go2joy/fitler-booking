import apiCaller from '@/api/apiCaller'

export async function fetchReferralReport (params) {
  return await apiCaller.get('referral/getReferralProgramHistory', { params: params })
}
