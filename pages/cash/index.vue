<template>
	<view class="cash-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" 
			shadow 
			background-color="#3b7cff" 
			status-bar 
			left-icon="left"
			left-text="返回"
			title="提现管理" 
			@clickLeft="uniback" />

		<!-- 账户余额卡片 -->
		<view class="balance-card">
			<view class="balance-header">
				<text class="title">账户余额(元)</text>
				<text class="amount">20,000.00</text>
			</view>
			<view class="balance-grid">
				<view class="grid-item">
					<text class="value">10,000.00</text>
					<text class="label">总收入(元)</text>
				</view>
				<view class="divider"></view>
				<view class="grid-item">
					<text class="value">1,000.00</text>
					<text class="label">已提现(元)</text>
				</view>
				<view class="divider"></view>
				<view class="grid-item">
					<text class="value">9,000.00</text>
					<text class="label">可提现(元)</text>
				</view>
			</view>
		</view>

		<!-- 提现说明卡片 -->
		<view class="info-card">
			<view class="card-title">
				<uni-icons type="info-filled" size="20" color="#3b7cff"></uni-icons>
				<text>提现说明</text>
			</view>
			<view class="info-content">
				<view class="info-item">
					<text class="dot"></text>
					<text>单笔提现金额不得低于100元</text>
				</view>
				<view class="info-item">
					<text class="dot"></text>
					<text>提现申请将在1-3个工作日内处理</text>
				</view>
				<view class="info-item">
					<text class="dot"></text>
					<text>提现金额将直接转入您的结算银行卡</text>
				</view>
			</view>
		</view>

		<!-- 提现记录卡片 -->
		<view class="record-card">
			<view class="card-title">
				<text>提现记录</text>
				
			</view>
			<view class="record-list" v-if="records.length > 0">
				<view class="record-item" v-for="(item, index) in records" :key="index">
					<view class="record-info">
						<text class="time">{{item.time}}</text>
						<text class="status" :class="item.status">{{item.statusText}}</text>
					</view>
					<text class="amount">-{{item.amount}}</text>
				</view>
			</view>
			<view class="empty-record" v-else>
				<image src="/static/images/empty.png" mode="aspectFit"></image>
				<text>暂无提现记录</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-button">
			<button class="withdraw-btn" @click="withdraw" hover-class="btn-hover">
				申请提现
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.cash-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 140rpx;
}

.balance-card {
	margin: 30rpx;
	background: linear-gradient(120deg, #3b7cff, #6c47ff);
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	color: #fff;
	box-shadow: 0 4rpx 20rpx rgba(59,124,255,0.3);

	.balance-header {
		text-align: center;
		margin-bottom: 40rpx;

		.title {
			font-size: 28rpx;
			opacity: 0.9;
			display: block;
			margin-bottom: 16rpx;
		}

		.amount {
			font-size: 60rpx;
			font-weight: 600;
		}
	}

	.balance-grid {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255,255,255,0.1);
		border-radius: 12rpx;
		padding: 30rpx;

		.grid-item {
			flex: 1;
			text-align: center;

			.value {
				font-size: 32rpx;
				font-weight: 500;
				display: block;
				margin-bottom: 8rpx;
			}

			.label {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}

		.divider {
			width: 2rpx;
			height: 50rpx;
			background: rgba(255,255,255,0.2);
		}
	}
}

.info-card, .record-card {
	margin: 0 30rpx 30rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

	.card-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 24rpx;

		.more {
			margin-left: auto;
			font-size: 26rpx;
			font-weight: normal;
			color: #3b7cff;
		}
	}
}

.info-content {
	.info-item {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 16rpx;
		font-size: 28rpx;
		color: #666;

		.dot {
			width: 8rpx;
			height: 8rpx;
			background: #3b7cff;
			border-radius: 50%;
		}
	}
}

.record-list {
	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		
		&:not(:last-child) {
			border-bottom: 2rpx solid #f5f5f5;
		}

		.record-info {
			.time {
				font-size: 28rpx;
				color: #333;
				display: block;
				margin-bottom: 8rpx;
			}

			.status {
				font-size: 24rpx;
				
				&.success {
					color: #00b578;
				}
				
				&.pending {
					color: #ff9f1c;
				}
				
				&.failed {
					color: #ff4d4f;
				}
			}
		}

		.amount {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
		}
	}
}

.empty-record {
	padding: 60rpx 0;
	text-align: center;

	image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	text {
		font-size: 28rpx;
		color: #999;
	}
}

.bottom-button {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.withdraw-btn {
	height: 90rpx;
	background: linear-gradient(120deg, #3b7cff, #6c47ff);
	border-radius: 45rpx;
	color: #fff;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;

	&::after {
		border: none;
	}
}

.btn-hover {
	transform: scale(0.98);
	opacity: 0.9;
}
</style>

<script>
export default {
	data() {
		return {
			records: [
				{
					time: '2024-03-15 14:30:25',
					amount: '1,000.00',
					status: 'success',
					statusText: '提现成功'
				},
				{
					time: '2024-03-14 16:45:12',
					amount: '2,500.00',
					status: 'pending',
					statusText: '处理中'
				},
				{
					time: '2024-03-13 09:20:33',
					amount: '800.00',
					status: 'failed',
					statusText: '提现失败'
				}
			]
		}
	},
	methods: {
		withdraw() {
			// uni.navigateTo({
			// 	url: '/pages/cash/withdraw'
			// })
		},
		uniback() {
			uni.navigateBack()
		}
	}
}
</script>
