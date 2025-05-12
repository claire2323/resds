import upload from '@/utils/upload'
import request from '@/utils/request'

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return upload({
    url: '/system/user/profile/avatar',
    name: data.name,
    filePath: data.filePath
  })
}


// 首页数量显示
export function IndexCount(){
	return request({
		url:'/communityCare/COrders/orderNumber',
		method:'get'
	})
}

// 服务人员信息列表
export function getPeopleList(storeId) {
  
  return request({
    url: '/communityCare/store/person/miniProgramsPageList',
    method: 'get',
    params: {
      storeId: storeId
    }
  })
}

// 获取订单列表和统计数据
export function getOrderList(data) {
  return request({
    url: '/communityCareCOrders/orderStatistics',
    method: 'get',
    params: data
  })
}
