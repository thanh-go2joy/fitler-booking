import apiCaller from './apiCaller'

export async function fetchProvinces (params) {
  return await apiCaller.get('provinces', { params: params })
}

export async function fetchDistricts (params) {
  return await apiCaller.get('districts', { params: params })
}

export async function fetchListDistricts (params) {
  return await apiCaller.get(`districts${params}`)
}
export async function fetchListProvinces (params) {
  return await apiCaller.get(`provinces?limit=100&status=1&regions=[${params}]`)
}
export async function fetchSuggestionProvinces () {
  return await apiCaller.get('suggestions/province?limit=100')
}
