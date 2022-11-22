import apiCaller from '@/api/apiCaller'

export async function fetchReferral (params) {
  return await apiCaller.get('referral/getReferralProgramList', { params: params })
}
