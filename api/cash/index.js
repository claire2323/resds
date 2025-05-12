import upload from '@/utils/upload'
import request from '@/utils/request'

// 获取订单统计数据
// api/api.js

export function getPersonList(storeId) {
  return request({
    url: '/communityCare/store/person/miniProgramsPageList',
    method: 'get',
    params: { storeId }
  });
}