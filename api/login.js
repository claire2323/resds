import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    'method': 'post',
    'data': data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/auth/getLoginUser',
    method: 'get'
  })
}

// 退出方法
export function logout(token) {
  return request({
    'url': '/auth/logout',
    'method': 'post',
    'data': token
  })
}


// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

export function getStoreInfo(){
	return request({
		url:'/communityCare/store/relation/pagelist',
		method:'get'
	})
}

export function getstoreOrderHome(flag) {
  return request({
    url: '/communityCare/COrders/storeOrderHome',
    method: 'get',
    params: {
      flag: flag
    }
  })
}

export function getserviceOrderHome(flag){
	return request({
		url:'/communityCare/COrders/serviceOrderHome',
		method:'get',
		params:{
			flag:flag
		}
	})
}

export function getStoreInfos(id){
	return request({
		url:`/communityCare/store/info/${id}`,
		method:'get'
	})
}