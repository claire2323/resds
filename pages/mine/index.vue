<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="user-profile">
        <view class="avatar-container" @click="handleToAvatar">
          <view v-if="!avatar" class="cu-avatar xl round bg-white">
            <view class="iconfont icon-people text-gray icon"></view>
          </view>
          <image v-if="avatar" :src="avatar" class="cu-avatar xl round" mode="aspectFill"></image>
        </view>
        <view class="user-details">
          <!-- <view v-if="!name" @click="handleToLogin" class="login-tip">
            <text>点击登录</text>
            <view class="iconfont icon-right"></view>
          </view> -->
          <view v-if="name" @click="handleToInfo" class="user-info">
            <view class="username">{{ name }}</view>
            <view class="user-id">ID: {{ userId || '未设置' }}</view>
          </view>
        </view>
		<view class="scan-btn-header" @click="handleScan">
			<image src="/static/svg/scan.svg" mode="aspectFit" class="scan-icon-header"></image>
		</view>
        <view @click="handleToInfo" class="profile-link">
          <text>个人信息</text>
          <view class="iconfont icon-right"></view>
        </view>
		
      </view>
    </view>

    <view class="content-section">
      <!-- 快捷操作区 -->
     <!-- <view class="quick-actions">
        <view class="action-item" @click="handleJiaoLiuQun">
          <view class="action-icon">
            <view class="iconfont icon-friendfill text-pink"></view>
          </view>
          <text class="action-text">交流群</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="action-icon">
            <view class="iconfont icon-service text-blue"></view>
          </view>
          <text class="action-text">在线客服</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="action-icon">
            <view class="iconfont icon-community text-mauve"></view>
          </view>
          <text class="action-text">反馈社区</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="action-icon">
            <view class="iconfont icon-dianzan text-green"></view>
          </view>
          <text class="action-text">点赞我们</text>
        </view>
      </view> -->

      <!-- 菜单列表 -->
      <view class="menu-list">
        <view class="menu-item" @click="handleToEditInfo">
          <view class="menu-icon">
            <view class="iconfont icon-user"></view>
          </view>
          <view class="menu-content">
            <text>编辑资料</text>
          </view>
          <view class="menu-arrow">
            <view class="iconfont icon-right"></view>
          </view>
        </view>
        
        <!-- <view class="menu-item" @click="handleHelp">
          <view class="menu-icon">
            <view class="iconfont icon-help"></view>
          </view>
          <view class="menu-content">
            <text>常见问题</text>
          </view>
          <view class="menu-arrow">
            <view class="iconfont icon-right"></view>
          </view>
        </view> -->
        
        <view class="menu-item" @click="handleAbout">
          <view class="menu-icon">
            <view class="iconfont icon-aixin"></view>
          </view>
          <view class="menu-content">
            <text>关于我们</text>
          </view>
          <view class="menu-arrow">
            <view class="iconfont icon-right"></view>
          </view>
        </view>
        
        <view class="menu-item" @click="handleToSetting">
          <view class="menu-icon">
            <view class="iconfont icon-setting"></view>
          </view>
          <view class="menu-content">
            <text>应用设置</text>
          </view>
          <view class="menu-arrow">
            <view class="iconfont icon-right"></view>
          </view>
        </view>
      </view>
      
      <!-- 版本信息 -->
      <view class="version-info">
        <text>当前版本 v{{ version }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import storage from '@/utils/storage'
  
  export default {
    data() {
      return {
        // name: this.$store.state.user.name,
        userId: this.$store.state.user.userId || '',
        version: getApp().globalData.config.appInfo.version
      }
    },
    computed: {
      avatar() {
        return this.$store.state.user.avatar
      },
      windowHeight() {
        return uni.getSystemInfoSync().windowHeight - 50
      }
    },
    methods: {
      handleToInfo() {
        this.$tab.navigateTo('/pages/mine/info/index')
      },
      handleToEditInfo() {
        this.$tab.navigateTo('/pages/mine/info/edit')
      },
      handleToSetting() {
        this.$tab.navigateTo('/pages/mine/setting/index')
      },
      handleToLogin() {
        this.$tab.reLaunch('/pages/login')
      },
      handleToAvatar() {
        this.$tab.navigateTo('/pages/mine/avatar/index')
      },
      handleLogout() {
        this.$modal.confirm('确定注销并退出系统吗？').then(() => {
          this.$store.dispatch('LogOut').then(() => {
            this.$tab.reLaunch('/pages/index')
          })
        })
      },
      handleHelp() {
        // this.$tab.navigateTo('/pages/mine/help/index')
      },
      handleAbout() {
        this.$tab.navigateTo('/pages/mine/about/index')
      },
      handleJiaoLiuQun() {
        this.$modal.showToast('模块建设中~')
      },
      handleBuilding() {
        this.$modal.showToast('模块建设中~')
      },
	  handleScan() {
	  	uni.navigateTo({
	  		url: '/pages/scan/index'
	  	})
	  },
    },
	onLoad(query) {
		if (query.username) {
			this.name = query.username
		}
		if (query.storeId){
			this.userId = query.storeId
		}
		this.getData()
	}
  }
</script>

<style lang="scss">
  page {
    background-color: #f5f6f7;
  }

  .mine-container {
    width: 100%;
    height: 100%;

    .header-section {
	  // margin-top: 5rpx;
      padding: 40rpx 30rpx 80rpx;
      background: linear-gradient(to bottom, #3c96f3, #3b7cff);
      color: white;
      position: relative;
      
      .user-profile {
        display: flex;
        align-items: center;
        position: relative;
        
        .avatar-container {
          position: relative;
          
          .cu-avatar {
            width: 140rpx;
            height: 140rpx;
            border: 4rpx solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
            
            .icon {
              font-size: 70rpx;
            }
          }
        }
        
        .user-details {
          flex: 1;
          margin-left: 30rpx;
          
          .login-tip {
            font-size: 36rpx;
            font-weight: 500;
            display: flex;
            align-items: center;
            
            .iconfont {
              font-size: 24rpx;
              margin-left: 10rpx;
            }
          }
          
          .user-info {
            .username {
              font-size: 36rpx;
              font-weight: 500;
              margin-bottom: 10rpx;
            }
            
            .user-id {
              font-size: 24rpx;
              opacity: 0.8;
            }
          }
        }
        .scan-btn-header {
        	width: 60rpx;
        	height: 60rpx;
        	display: flex;
        	align-items: center;
        	justify-content: center;
        	margin-right: 20rpx;
        	.scan-icon-header {
        		width: 44rpx;
        		height: 44rpx;
        		filter: brightness(0) invert(1); // 使图标变为白色
        	}
        }
        
        .profile-link {
          display: flex;
          align-items: center;
          font-size: 28rpx;
          padding: 10rpx 20rpx;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 30rpx;
          
          .iconfont {
            margin-left: 6rpx;
            font-size: 24rpx;
          }
        }
      }
    }

    .content-section {
      position: relative;
      margin-top: 50rpx;
      // padding: 0 30rpx;
      
      .quick-actions,
      .menu-list {
        width: calc(100% - 10rpx);
        margin: 0 auto 30rpx;
        background-color: #ffffff;
        border-radius: 16rpx;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
      }

      .quick-actions {
        display: flex;
        justify-content: space-between;
        padding: 30rpx;
        
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          
          .action-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: #f8f8f8;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 16rpx;
            
            .iconfont {
              font-size: 42rpx;
            }
          }
          
          .action-text {
            font-size: 26rpx;
            color: #333333;
            text-align: center;
          }
        }
      }
      
      .menu-list {
        overflow: hidden;
        
        .menu-item {
          display: flex;
          align-items: center;
          padding: 32rpx 30rpx;
          position: relative;
          
          &:not(:last-child)::after {
            content: '';
            position: absolute;
            left: 110rpx;
            right: 30rpx;
            bottom: 0;
            height: 1px;
            background-color: #f5f5f5;
          }
          
          .menu-icon {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            background-color: #f8f8f8;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 20rpx;
            
            .iconfont {
              font-size: 32rpx;
              color: #3c96f3;
            }
          }
          
          .menu-content {
            flex: 1;
            font-size: 30rpx;
            color: #333333;
          }
          
          .menu-arrow {
            color: #cccccc;
            
            .iconfont {
              font-size: 24rpx;
            }
          }
        }
      }
      
      .version-info {
        text-align: center;
        font-size: 24rpx;
        color: #999999;
        padding: 30rpx 0;
      }
    }
  }
</style>
