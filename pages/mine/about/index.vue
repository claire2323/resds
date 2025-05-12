<template>
  <view class="about-container">
    <!-- 头部 Logo 和名称 -->
    <view class="header-section">
      <image class="logo-image" src="/static/images/loading.png" mode="aspectFit"></image>
      <view class="app-title">智慧养老服务移动端</view>
      <view class="app-version">Version {{ version }}</view>
    </view>

    <!-- 公司信息卡片 -->
    <view class="info-section">
      <view class="section-title">公司信息</view>
      
      <view class="info-card">
        <view class="info-item" @click="copyText('ruoyi@xx.com')">
          <view class="item-left">
			<image :src="svgIcon1" class="svg-section" mode="aspectFit"></image>
            <text class="item-label">官方邮箱</text>
          </view>
          <view class="item-right">
            <text class="item-value">xxx@xx.com</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        
        <view class="info-item" @click="makePhoneCall('400-999-9999')">
          <view class="item-left">
            <image :src="svgIcon2" class="svg-section" mode="aspectFit"></image>
            <text class="item-label">服务热线</text>
          </view>
          <view class="item-right">
            <text class="item-value">400-999-9999</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
        
        <view class="info-item" @click="openWebsite">
          <view class="item-left">
            <image :src="svgIcon3" class="svg-section" mode="aspectFit"></image>
            <text class="item-label">公司网站</text>
          </view>
          <view class="item-right">
            <text class="item-value">xxxx</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 关于我们卡片 -->
    <view class="about-us-section">
      <view class="section-title">关于我们</view>
      
      <view class="about-card">
        <view class="about-text">
          智慧养老服务移动端xxxxx
        </view>
      </view>
    </view>
    
    <!-- 底部版权信息 -->
    <view class="copyright">
      <view>Copyright &copy; 2025 All Rights Reserved.</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        url: getApp().globalData.config.appInfo.site_url,
        version: getApp().globalData.config.appInfo.version,
		svgIcon1:'/static/svg/email.svg',
		svgIcon2:'/static/svg/phone.svg',
		svgIcon3:'/static/svg/Website.svg'
      }
    },
    methods: {
      copyText(text) {
        uni.setClipboardData({
          data: text,
          success: () => {
            uni.showToast({
              title: '复制成功',
              icon: 'success'
            });
          }
        });
      },
      makePhoneCall(phone) {
        uni.makePhoneCall({
          phoneNumber: phone
        });
      },
      openWebsite() {
        // 在应用内打开网页或跳转至浏览器
        uni.navigateTo({
          url: `/pages/common/webview?url=${encodeURIComponent(this.url)}`
        });
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f7fa;
  }

  .about-container {
    padding: 30rpx;
  }

  .header-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50rpx 0;
    
    .logo-image {
      width: 150rpx;
      height: 150rpx;
      border-radius: 30rpx;
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
      margin-bottom: 30rpx;
    }
    
    .app-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .app-version {
      font-size: 26rpx;
      color: #999;
    }
  }

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 20rpx;
    border-left: 8rpx solid #2979ff;
  }

  .info-section, .about-us-section {
    margin-bottom: 30rpx;
  }
  
  .info-card, .about-card {
    background-color: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-left {
      display: flex;
      align-items: center;
      
      .iconfont {
        font-size: 40rpx;
        color: #2979ff;
        margin-right: 20rpx;
      }
      
      .item-label {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .item-right {
      display: flex;
      align-items: center;
      
      .item-value {
        font-size: 28rpx;
        color: #666;
        margin-right: 10rpx;
      }
      
      .iconfont {
        font-size: 30rpx;
        color: #ccc;
      }
    }
  }
  
  .about-text {
    padding: 30rpx;
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }

  .copyright {
    margin-top: 50rpx;
    text-align: center;
    font-size: 24rpx;
    line-height: 60rpx;
    color: #999;
  }

  /* 添加图标字体 */


  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .svg-section {
      width: 50rpx;
      height: 50rpx;
	  margin: 0, auto;
      margin-right: 20rpx;
      transition: fill 0.3s ease; // 图标颜色过渡

  }

  .icon-email:before {
    content: "\e605";
  }

  .icon-phone:before {
    content: "\e606";
  }

  .icon-globe:before {
    content: "\e607";
  }

  .icon-right:before {
    content: "\e608";
  }
</style>
