import { getToken } from '@/utils/auth'

// 登录页面
const loginPage = "/pages/login"
  
// 页面白名单
const whiteList = [
  '/pages/login', '/pages/register', '/pages/beforeLogin', '/pages/common/webview/index',
]

// 检查地址白名单
function checkWhite(url) {
  const path = url.split('?')[0]
  console.log('我要看看',url,whiteList.indexOf(path) !== -1)
  return whiteList.indexOf(path) !== -1
}

// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
  uni.addInterceptor(item, {
    invoke(to) {
      if (getToken()) {
        if (to.url === loginPage) {
          uni.reLaunch({ url: "/" })
        }
        return true
      } else {
        if (checkWhite(to.url)) {
          return true
        }
        else{
          uni.reLaunch({ url: loginPage })
          return false
        }
        
      }
    },
    fail(err) {
      console.log(err)
    }
  })
})
