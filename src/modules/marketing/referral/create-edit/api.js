import apiCaller from '@/api/apiCaller'

export async function fetchReferralProgram (params) {
  return await apiCaller.get('referral/getReferralProgramDetail', { params: params })
}
export async function editReferral (formData) {
  return await apiCaller.post('referral/updateReferralProgram', formData)
}
export async function createReferral (formData) {
  return await apiCaller.post('referral/createReferralProgram', formData)
}
