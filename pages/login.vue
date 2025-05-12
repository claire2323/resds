<template>
  <view class="login-container">
    <!-- 顶部背景 -->
    <view class="top-bg"></view>

    <!-- 登录表单区域 -->
    <view class="login-box">
      <!-- Logo -->
      <view class="logo-box">
        <image class="logo" :src="image" mode="aspectFit"></image>
        <text class="title">欢迎登录</text>
      </view>

      <!-- 表单输入区 -->
      <view class="input-group">
        <view class="input-box">
          <text class="iconfont icon-user"></text>
          <input v-model="loginForm.username" type="text" placeholder="请输入账号" maxlength="30" />
        </view>

        <view class="input-box">
          <text class="iconfont icon-password"></text>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" maxlength="20" />
        </view>

        <view class="input-box verify-box" v-if="captchaEnabled">
          <text class="iconfont icon-code"></text>
          <input v-model="loginForm.code" type="number" placeholder="请输入验证码" maxlength="4" />
          <image :src="codeUrl" @click="getCode" class="verify-img"></image>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button @click="handleLogin" class="login-btn">登 录</button>

      <!-- 底部链接 -->
      <view class="bottom-links">
        <view class="register-link" @click="handleUserRegister">
          <text>没有账号？立即注册</text>
        </view>
       <!-- <view class="agreement-links">
          <text class="text-grey">登录即代表同意</text>
          <text @click="handleUserAgrement" class="link">《用户协议》</text>
          <text @click="handlePrivacy" class="link">《隐私政策》</text>
        </view> -->
      </view>
    </view>

    <!-- 身份选择弹窗 -->
    <uni-popup ref="identityPopup" type="center">
      <view class="identity-popup">
        <view class="popup-title">选择您的身份</view>
        <view class="identity-options">
          <view class="identity-option" @click="selectIdentity('STORE')">
            <text>商家端</text>
          </view>
          <view class="identity-option" @click="selectIdentity('EMPLOYEE')">
            <text>员工端</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { getCodeImg, login, getInfo } from '@/api/login'

export default {
  data() {
    return {
      image: '/static/images/loading.png',
      codeUrl: "",
      captchaEnabled: true,
      register: true,
      globalConfig: getApp().globalData.config,
      loginForm: {
        username: "17784751112",
        password: "751112",
        code: "",
        uuid: '',
        userGroup: 'STORE'
      },
      roleId: '',
      selectedIdentity: '' // 存储选择的身份
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    // 用户注册
    handleUserRegister() {
      this.$tab.navigateTo('/pages/register')
    },
    // 隐私协议
    handlePrivacy() {
      let site = this.globalConfig.appInfo.agreements[0]
      this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
    },
    // 用户协议
    handleUserAgrement() {
      let site = this.globalConfig.appInfo.agreements[1]
      this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
    },
    // 获取图形验证码
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    // 登录方法
    async handleLogin() {
      if (this.loginForm.username === "") {
        this.$modal.msgError("请输入您的账号")
      } else if (this.loginForm.password === "") {
        this.$modal.msgError("请输入您的密码")
      } else {
        this.$modal.loading("登录中，请耐心等待...")
        this.pwdLogin()
      }
    },
    // 密码登录
    async pwdLogin() {
      // this.$store.dispatch(
      //   'Login',
      //   this.loginForm
      // ).then((item) => {
      //   this.$modal.closeLoading()
      //   // 登录成功后打开身份选择弹窗
      //   // 后续获取身份判断
      //   this.$refs.identityPopup.open()
      // }).catch(() => {
      //   if (this.captchaEnabled) {
      //     this.getCode()
      //   }
      // })
      await login(this.loginForm).then((item) => {
        uni.setStorageSync('App-Token', item.data.access_token)
        this.$modal.closeLoading()
        // 登录成功后打开身份选择弹窗
        // 后续获取身份判断
        this.$refs.identityPopup.open()
      }).catch(() => {
        if (this.captchaEnabled) {
          this.getCode()
        }
      })
      await this.$store.dispatch('GetInfo').then(res => {
        // 根据选择的身份跳转到不同页面
        //console.log(item.data.sysUser.roleIds[0])//1店长·0店员
        console.log('GetInfo', res)
        this.roleId = res.data.sysUser.roleIds[0]
      }).catch(err => {
        console.error(err)
        this.$modal.msgError("获取用户信息失败")
      })
    },
    // 选择身份
    selectIdentity(identity) {
      this.selectedIdentity = identity
      this.$refs.identityPopup.close()
      // 保存选择的身份到本地存储
      uni.setStorageSync('userIdentity', identity)
      // 获取用户信息
      this.getUserInfo()
    },
    // 获取用户信息并跳转
    getUserInfo() {
      if (this.selectedIdentity === 'STORE') {
        if (!this.roleId) {//0是店员
          uni.showToast({
            title: '当前为店员账号不可使用商户端',
            icon: 'none',
            duration: 2000
          })
        }
        else {
          uni.reLaunch({
            url: '/pages/index'
          })
        }
      } else if (this.selectedIdentity === 'EMPLOYEE') {
        if (this.roleId) {//1是店长
          uni.showToast({
            title: '当前为店长账号不可使用员工端',
            icon: 'none',
            duration: 2000
          })
        } else {
          uni.reLaunch({
            url: '/pages/employee/index'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.top-bg {
  height: 400rpx;
  background: linear-gradient(45deg, #3b7cff, #6c47ff);
  border-bottom-left-radius: 40% 15%;
  border-bottom-right-radius: 40% 15%;
}

.login-box {
  position: absolute;
  top: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  padding: 40rpx;
}

.logo-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

  .logo {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 20rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.input-group {
  margin-bottom: 40rpx;
}

.input-box {
  display: flex;
  align-items: center;
  height: 90rpx;
  background-color: #f8f8f8;
  border-radius: 45rpx;
  margin-bottom: 30rpx;
  padding: 0 30rpx;

  .iconfont {
    font-size: 40rpx;
    color: #999;
    margin-right: 20rpx;
  }

  input {
    flex: 1;
    font-size: 28rpx;
  }
}

.verify-box {
  .verify-img {
    width: 200rpx;
    height: 60rpx;
    border-radius: 6rpx;
  }
}

.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(45deg, #3b7cff, #6c47ff);
  border-radius: 45rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 40rpx;

  &:active {
    opacity: 0.8;
  }
}

.bottom-links {
  text-align: center;

  .register-link {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #666;
  }

  .agreement-links {
    font-size: 24rpx;
    color: #999;

    .link {
      color: #3b7cff;
      margin: 0 10rpx;
    }
  }
}

/* 身份选择弹窗样式 */
.identity-popup {
  width: 600rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
}

.identity-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.identity-option {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  font-size: 32rpx;
  color: #333;

  &:active {
    background-color: #e8e8e8;
  }
}
</style>
