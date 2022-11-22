import apiCaller from '@/api/apiCaller'

export async function fetchReferralProgram (params) {
  return await apiCaller.get('referral/getReferralProgramDetail', { params: params })
}
