
import apiCaller from '@/api/apiCaller'

async function listReview (params) {
  params.ratings = JSON.parse(JSON.stringify(params.ratings))
  return await apiCaller.get('hotel-reviews', { params: params })
}
export {
  listReview
}
