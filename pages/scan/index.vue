<template>
	<view class="scan-container">
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" title="食堂签到码" @clickLeft="goBack" />
		<view class="qrcode-container">
			<view class="qrcode-box">
				<image v-if="qrCodeUrl" :src="qrCodeUrl" mode="aspectFit" class="qrcode-image"></image>
				<view v-else class="loading">加载中...</view>
				<view class="qrcode-tip">请扫描此二维码进行签到</view>
			</view>
			
			<button class="refresh-btn" @click="refreshQrCode">刷新二维码</button>
		</view>
	</view>
</template>

<script>
import { getQrCode } from '@/api/elder'
import { getstoreOrderHome } from '@/api/login'

export default {
	data() {
		return {
			qrCodeUrl: '',
			refreshTimer: null,
			storeId: ''
		}
	},
	async created() {
		// 获取商户信息
		const { code, data } = await getstoreOrderHome('STORE')
		if (code === 200) {
			this.storeId = data.storeId
			this.getQrCode()
		}
		this.startAutoRefresh()
	},
	methods: {
		goBack() {
			if (this.refreshTimer) {
				clearInterval(this.refreshTimer)
			}
			uni.navigateBack()
		},
		async getQrCode() {
			try {
				const res = await getQrCode({
					type: "3", // 固定使用食堂二维码类型
					content: this.storeId // 传入商户ID
				})
				// console.log('storeId:', this.storeId)
				// console.log(res)
				if (res.code === 200 && res.msg) {
					this.qrCodeUrl = res.msg
				} else {
					uni.showToast({
						title: '获取二维码失败',
						icon: 'none'
					})
				}
			} catch (error) {
				console.error('获取二维码出错:', error)
				uni.showToast({
					title: '获取二维码失败',
					icon: 'none'
				})
			}
		},
		refreshQrCode() {
			this.getQrCode()
		},
		startAutoRefresh() {
			// 每3分钟自动刷新一次二维码
			this.refreshTimer = setInterval(() => {
				this.getQrCode()
			}, 3* 60 * 1000)
		}
	},
	beforeDestroy() {
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer)
		}
	}
}
</script>

<style lang="scss" scoped>
.scan-container {
	min-height: 100vh;
	background: #f5f5f5;
	
	.qrcode-container {
		padding-top: 88rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx;
		
		.qrcode-box {
			background: #fff;
			border-radius: 20rpx;
			padding: 40rpx;
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
			margin-bottom: 40rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.qrcode-image {
				width: 500rpx;
				height: 500rpx;
				margin-bottom: 20rpx;
			}
			
			.loading {
				width: 500rpx;
				height: 500rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #999;
			}
			
			.qrcode-tip {
				font-size: 28rpx;
				color: #666;
				margin-top: 20rpx;
			}
		}
		
		.refresh-btn {
			width: 80%;
			height: 80rpx;
			line-height: 80rpx;
			background: #3b7cff;
			color: #fff;
			border-radius: 40rpx;
			font-size: 28rpx;
			
			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style> 