import upload from '@/utils/upload'
import request from '@/utils/request'

// 查询订单统计
export function getOrderList(flag, params = {}) {
  if (!flag || (flag !== 'STORE' && flag !== 'SERVICE')) {
    console.error('flag参数必须是STORE或SERVICE');
    return Promise.reject(new Error('flag参数无效'));
  }

  return request({
    url: '/communityCare/COrders/orderStatistics',
    method: 'get',
    headers: {
      isToken: true
    },
    params: {
      flag,
      ...params 
    }
  })
}

// 获取服务类型
export function getServiveType() {
  return request({
    url: '/communityCare/ServiceType/getSecondLevelAll',
    method: 'get',
  })
}

// 订单详情
export function orderDetail(id) {
  return request({
    url: `/communityCare/COrders/${id}`,
    method: 'get',
  })
}

// 拒绝接受订单 
export function changeOrder(params) {
  return request({
    url: '/communityCare/COrders/OrderDoStore',
    method: 'get',
	params
  })
}

// 服务人员列表
export function getSpList() {
  return request({
    url: '/communityCare/store/person/pagelist',
    method: 'get',
  })
}

// 支配服务人员
export function toServicePeople(data) {
  return request({
    url: '/communityCare/COrders/assignedPersonnel',
    method: 'put',
	data
  })
}