<template>
	<view class="detail-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" 
			shadow 
			background-color="#3b7cff" 
			status-bar 
			left-icon="left"
			left-text="返回"
			title="订单详情" 
			@clickLeft="uniback" />

		<!-- 订单状态卡片 -->
		<view class="status-card">
			<view class="order-number">
				订单编号：{{formData.code}}
			</view>
			<view class="status-info">
				<uni-icons type="person-filled" size="30" color="#3b7cff"></uni-icons>
				<text class="status-text">
					{{orderState == 'DISTRIBUTION_STORE' ? '待派单' : '待接单'}}
				</text>
			</view>
		</view>

		<!-- 订单详情卡片 -->
		<view class="info-card">
			<view class="card-title">服务信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">服务名称</text>
					<text class="value">{{formData.serviceName}}</text>
				</view>
				<view class="info-item">
					<text class="label">服务数量</text>
					<text class="value">{{formData.serviceNum}}</text>
				</view>
				<view class="info-item">
					<text class="label">长者姓名</text>
					<text class="value">{{formData.elderName}}</text>
				</view>
				<view class="info-item">
					<text class="label">服务地址</text>
					<text class="value">{{formData.serviceAddr}}</text>
				</view>
				<view class="info-item">
					<text class="label">联系电话</text>
					<text class="value">{{formData.phone}}</text>
				</view>
			</view>
		</view>

		<!-- 时间信息卡片 -->
		<view class="info-card">
			<view class="card-title">时间信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">申请时间</text>
					<text class="value">{{formData.applyTime}}</text>
				</view>
				<view class="info-item">
					<text class="label">分配时间</text>
					<text class="value">{{formData.distributionTime}}</text>
				</view>
				<view class="info-item">
					<text class="label">派单时间</text>
					<text class="value">{{formData.sendTime}}</text>
				</view>
				<view class="info-item">
					<text class="label">服务时间</text>
					<text class="value">{{formData.serviceTime}}</text>
				</view>
			</view>
		</view>

		<!-- 金额信息卡片 -->
		<view class="info-card">
			<view class="card-title">金额信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">订单金额</text>
					<text class="value price">¥{{formData.orderMoney}}</text>
				</view>
				<view class="info-item">
					<text class="label">结算金额</text>
					<text class="value price">¥{{formData.serviceMoney}}</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-button">
			<view class="button-group" v-if="orderState == 'DISTRIBUTION_STORE'">
				<button class="btn refuse-btn" @click="setOrder('STORE_REFUSE')">拒绝订单</button>
				<button class="btn accept-btn" @click="setOrder('STORE_ACCEPT')">接受订单</button>
			</view>
			<view class="button-group" v-else>
				<button class="btn assign-btn" @click="toService">指派订单</button>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.detail-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 140rpx;
}

.status-card {
	margin: 30rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

	.order-number {
		font-size: 28rpx;
		color: #666;
	}

	.status-info {
		display: flex;
		align-items: center;
		gap: 12rpx;

		.status-text {
			font-size: 30rpx;
			color: #3b7cff;
			font-weight: 500;
		}
	}
}

.info-card {
	margin: 0 30rpx 30rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

	.card-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 24rpx;
	}

	.info-list {
		.info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			
			&:not(:last-child) {
				border-bottom: 2rpx solid #f5f5f5;
			}

			.label {
				font-size: 28rpx;
				color: #666;
			}

			.value {
				font-size: 28rpx;
				color: #333;
				
				&.price {
					color: #ff6b6b;
					font-weight: 500;
				}
			}
		}
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

	.button-group {
		display: flex;
		gap: 20rpx;

		.btn {
			flex: 1;
			height: 90rpx;
			border-radius: 45rpx;
			font-size: 32rpx;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				border: none;
			}

			&:active {
				transform: scale(0.98);
				opacity: 0.9;
			}
		}

		.refuse-btn {
			background: #f8f9fc;
			color: #666;
			border: 2rpx solid #e5e5e5;
		}

		.accept-btn, .assign-btn {
			background: linear-gradient(120deg, #3b7cff, #6c47ff);
			color: #fff;
		}
	}
}
</style>

<script>
	import {
		toast
	} from '@/utils/common'
	import {
		orderDetail,
		changeOrder
	} from '@/api/order/index.js'
	export default {
		data() {
			return {
				id: '',
				formData: {},
				orderState:null
			}
		},
		methods: {

			async getData() {
				const {
					data,
					code
				} = await orderDetail(this.id)

				if (code == 200) {
					this.formData = {
						...data
					}
					this.orderState = data.orderState
				}
			},
			async setOrder(flag) {
				const {
					code,
					msg
				} = await changeOrder({
					id: this.formData.id,
					flag
				})
				toast(msg)
				if (code == 200) {
					uni.navigateTo({
						url: '/pages/index',
					});
				} else {

				}
			},
				
			toService() {
				uni.navigateTo({
					url: `/pages/order/servicePeople/servicePeople?id=${this.formData.id}&code=${this.formData.code}`,
				});
			},

			uniback() {
				uni.navigateBack()
			}
		},
		created() {
			this.getData()
		},
		onLoad(options) {
			this.id = options.id
		}
	}
</script>