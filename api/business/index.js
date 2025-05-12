import upload from '@/utils/upload'
import request from '@/utils/request'

// 获取订单统计数据
export function getOrderStatistics(flag, params = {}) {
  // 确保flag参数存在且有效
  if (!flag || (flag !== 'STORE' && flag !== 'SERVICE')) {
    console.error('flag参数必须是STORE或SERVICE');
    return Promise.reject(new Error('flag参数无效'));
  }
  
  // 合并参数，确保flag被包含
  const queryParams = { ...params, flag };
  
  return request({
    url: '/communityCare/COrders/orderStatistics',
    method: 'get',
    headers: {
      isToken: true
    },
    params: queryParams
  })
}
