<template>
	<view class="scan-code-container">
		<!-- 自定义导航栏 -->
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" left-text="返回"
			title="扫描消费码" @clickLeft="goBack" />
		<!-- <view class="custom-navbar">
			<view class="navbar-left" @click="goBack">
				<text class="iconfont icon-back"></text>
				<text class="navbar-title">返回</text>
			</view>
			<view class="navbar-title"></view>
			<view class="navbar-right"></view>
		</view> -->
		
		<!-- 扫码区域 -->
		<view class="scan-area">
			<camera mode="scanCode" class="camera" device-position="back" :flash="flashMode" @error="error"></camera>
			<cover-view class="scan-frame"></cover-view>
			<cover-view class="scan-hint">请将消费码放入框内</cover-view>
		</view>
		
		
		<!-- 照明按钮 -->
		<view class="flashlight-btn" @click="toggleFlash">
			<text class="flashlight-icon">{{ flashMode === 'on' ? '🔦' : '🔦' }}</text>
			<text class="flashlight-text">照明</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				flashMode: 'off' // 默认关闭闪光灯
			}
		},
		onLoad(options) {
			if (options.orderId) {
				this.orderId = options.orderId;
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			error(e) {
				console.error('相机错误:', e);
				uni.showToast({
					title: '相机启动失败，请检查权限设置',
					icon: 'none'
				});
			},
			// 切换闪光灯状态
			toggleFlash() {
				this.flashMode = this.flashMode === 'on' ? 'off' : 'on';
				uni.showToast({
					title: this.flashMode === 'on' ? '已开启照明' : '已关闭照明',
					icon: 'none',
					duration: 1000
				});
			},
			// 扫码成功后的处理
			scanSuccess(code) {
				// 这里处理扫码成功后的逻辑
				uni.showLoading({
					title: '处理中'
				});
				
				// 模拟请求
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '已开始服务'
					});
					
					// 返回上一页并刷新
					uni.navigateBack({
						success: () => {
							// 获取上一页实例并调用刷新方法
							const pages = getCurrentPages();
							const prevPage = pages[pages.length - 2];
							prevPage.loadOrdersByState();
						}
					});
				}, 1000);
			}
		}
	}
</script>

<style lang="scss">
	.scan-code-container {
		min-height: 100vh;
		background-color: #000;
		position: relative;
	}
	
	/* 自定义导航栏 */
	.custom-navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		padding-top: var(--status-bar-height);
		background-color: #000;
		padding-left: 30rpx;
		padding-right: 30rpx;
		color: #fff;
		
		.navbar-left {
			display: flex;
			align-items: center;
			
			.iconfont {
				font-size: 40rpx;
				margin-right: 10rpx;
			}
		}
		
		.navbar-title {
			font-size: 34rpx;
			font-weight: 500;
		}
	}
	
	/* 扫码区域 */
	.scan-area {
		position: relative;
		width: 100%;
		height: 750rpx;
		
		.camera {
			width: 100%;
			height: 100%;
		}
		
		.scan-frame {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 500rpx;
			height: 500rpx;
			border: 4rpx solid #3b7cff;
			border-radius: 20rpx;
		}
		
		.scan-hint {
			position: absolute;
			bottom: 50rpx;
			left: 0;
			right: 0;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
		}
	}
	
	/* 底部提示 */
	.bottom-tips {
		position: absolute;
		bottom: 100rpx;
		left: 0;
		right: 0;
		text-align: center;
		color: #fff;
		font-size: 30rpx;
	}
	
	/* 照明按钮 */
	.flashlight-btn {
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		
		.flashlight-icon {
			font-size: 48rpx;
			margin-bottom: 10rpx;
		}
		
		.flashlight-text {
			font-size: 24rpx;
		}
	}
</style>