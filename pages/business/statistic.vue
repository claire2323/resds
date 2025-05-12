<template>
	<view class="container">
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" left-text="返回"
			title="订单统计" @clickLeft="back" />
		<view class="header-section">
			<view class="stats-card">
				<view class="stats-item">
					<text class="label">订单金额</text>
					<text class="value">¥{{orderMoney}}</text>
				</view>
				<view class="divider"></view>
				<view class="stats-item">
					<text class="label">结算金额</text>
					<text class="value">¥{{orderSettlementMoney}}</text>
				</view>
				<view class="divider"></view>
				<view class="stats-item">
					<text class="label">记录数</text>
					<text class="value">{{orderSize}}条</text>
				</view>
			</view>
		</view>
		<view class="filter-section">
			<view class="select-row">
				<uni-data-select class="select-item" v-model="formData.serviceTypeId" :localdata="serve_state" @change="changeService"
					placeholder="服务类型">
				</uni-data-select>
				<uni-data-select class="select-item" v-model="formData.orderState" :localdata="order_state" @change="changeOrder"
					placeholder="订单状态">
				</uni-data-select>
				<uni-data-select class="select-item" v-model="formData.timeFlag" :localdata="time_state" @change="changeTime"
					placeholder="接单时间">
				</uni-data-select>
			</view>
		</view>
		<view class="order-list">
			<view class="order-card" v-for="(item, index) in tableData" :key="index" @click="toDetail(item.id)">
				<view class="order-header">
					<text class="order-no">订单编号：{{item.code}}</text>
					<text class="order-status" :class="getStatusClass(item.orderState)">
						{{showOrder(item.orderState)}}
					</text>
				</view>
				<view class="order-content">
					<view class="info-row">
						<text class="label">服务名称：</text>
						<text class="value">{{item.serviceName}}</text>
					</view>
					<view class="info-row">
						<text class="label">服务人员：</text>
						<text class="value">{{item.servicePeopleId}}</text>
					</view>
					<view class="info-row">
						<text class="label">联系电话：</text>
						<text class="value">{{item.phone}}</text>
					</view>
					<view class="info-row">
						<text class="label">服务地址：</text>
						<text class="value">{{item.serviceAddr}}</text>
					</view>
					<view class="info-row">
						<text class="label">申请时间：</text>
						<text class="value">{{item.serviceTime}}</text>
					</view>
					<view class="info-row">
						<text class="label">订单金额：</text>
						<text class="value price">¥{{item.orderMoney}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getOrderList } from '@/api/order/index.js'
	export default {
		componts: {},
		data() {
			return {
				serve_state: [
					// 静态数据，因为没有获取服务类型的API
					{
						text: '全部服务',
						value: ''
					},
					{
						text: '家电维修',
						value: '1'
					},
					{
						text: '家政服务',
						value: '2'
					},
					{
						text: '居家照护',
						value: '3'
					}
				],
				time_state: [{
						text: '今日',
						value: 'TIME_TODAY'
					},
					{
						text: '本周',
						value: 'TIME_WEEK'
					},
					{
						text: '本月',
						value: 'TIME_MONTH'
					}, {
						text: '上个月',
						value: 'TIME_LAST_MONTH'
					}, {
						text: '半年',
						value: 'TIME_HALF_YEAR'
					}, {
						text: '近一年',
						value: 'TIME_NEARLY_YEAR'
					}
				],
				order_state: [{
						text: '待派单',
						value: 'AWAIT_DISTRIBUTION_SERVICE'
					},
					{
						text: '待接单',
						value: 'AWAIT_ACCEPT'
					},
					{
						text: '待上门',
						value: 'AWAIT_DISTRIBUTION_STORE'
					},
					{
						text: '待服务',
						value: 'AWAIT_DROP_IN'
					},
					{
						text: '服务中',
						value: 'SERVICE'
					},
					{
						text : '取消订单',
						value: 'CANCEL_ORDER'
					},
					{
						text: '已完成',
						value:'DISTRIBUTION_STORE'
					}
				],
				formData: {},
				tableData: [],
				orderMoney: 0,
				orderSettlementMoney: 0,
				orderSize: 0
			};
		},
		methods: {
			changeService(event) {
				this.formData.serviceTypeId = event
				this.getData()
			},
			changeOrder(event) {
				this.formData.orderState = event
				this.getData()
			},
			changeTime(event) {
				this.formData.timeFlag = event
				this.getData()
			},
			back() {
				this.formData = {}
				uni.navigateTo({
					url: '/pages/index',
				});
			},
			async getData() {
				uni.showLoading({
					title: '加载中'
				})
				try {
					const {
						code,
						data
					} = await getOrderList('STORE',this.formData)
					console.log(data)
					if (code == 200) {
						this.tableData = [...data.list]
						this.orderMoney = data.orderMoney || 0
						this.orderSettlementMoney = data.orderSettlementMoney || 0
						this.orderSize = data.num || 0
					} else {
						uni.showToast({
							title: '获取数据失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('获取订单数据出错:', error)
					uni.showToast({
						title: '网络异常，请稍后重试',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/order/orderDetail/orderDetail?id=${id}`,
				});
			},
			getStatusClass(status) {
				const statusMap = {
					'AWAIT_DISTRIBUTION_STORE': 'pending',
					'AWAIT_ACCEPT': 'pending',
					'AWAIT_DROP_IN': 'processing',
					'SERVICE': 'processing'
				};
				return statusMap[status] || 'pending';
			}
		},
		computed: {
			showOrder() {
				return function(value) {
					const found = this.order_state.find(item => item.value == value)
					return found ? found.text : '未知状态'
				}
			}
		},
		onLoad(query) {
			if (query.orderState) {
				this.formData.orderState = query.orderState
			}
			this.getData()
		}
	};
</script>

<style lang="scss" scoped>
$primary-color: #3b7cff;
$text-color: #333333;
$text-light: #666666;
$border-color: #EEEEEE;
$bg-color: #F5F7FA;

.container {
	min-height: 100vh;
	background-color: $bg-color;
}

.header-section {
	background: $primary-color;
	padding: 30rpx 20rpx;
	margin-bottom: 20rpx;

	.stats-card {
		background: #ffffff;
		border-radius: 12rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);

		.stats-item {
			flex: 1;
			text-align: center;

			.label {
				font-size: 24rpx;
				color: $text-light;
				margin-bottom: 12rpx;
				display: block;
			}

			.value {
				font-size: 36rpx;
				color: $primary-color;
				font-weight: 600;
			}
		}

		.divider {
			width: 2rpx;
			height: 60rpx;
			background: $border-color;
			margin: 0 20rpx;
		}
	}
}

.filter-section {
	background: #ffffff;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	
	.select-row {
		display: flex;
		gap: 20rpx;
		
		.select-item {
			flex: 1;
			:deep(.uni-data-select) {
				border: 2rpx solid $border-color;
				border-radius: 8rpx;
			}
		}
	}
}

.order-list {
	padding: 20rpx;

	.order-card {
		background: #ffffff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
		}

		.order-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid $border-color;

			.order-no {
				font-size: 28rpx;
				color: $text-color;
				font-weight: 500;
			}

			.order-status {
				font-size: 24rpx;
				padding: 6rpx 20rpx;
				border-radius: 24rpx;
				
				&.pending {
					color: #FF9800;
					background: rgba(255,152,0,0.1);
				}
				
				&.processing {
					color: $primary-color;
					background: rgba(7,193,96,0.1);
				}
				
				&.completed {
					color: #8799A3;
					background: rgba(135,153,163,0.1);
				}
			}
		}

		.order-content {
			padding-top: 20rpx;

			.info-row {
				display: flex;
				margin-bottom: 16rpx;
				font-size: 26rpx;
				line-height: 1.5;
				
				.label {
					color: $text-light;
					width: 160rpx;
					flex-shrink: 0;
				}
				
				.value {
					color: $text-color;
					flex: 1;
					
					&.price {
						color: $primary-color;
						font-weight: 500;
					}
				}
			}

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}

// 深度选择器修改组件样式
:deep(.uni-select--disabled) {
	background-color: #ffffff !important;
}

:deep(.uni-select__input-text) {
	font-size: 26rpx !important;
}
</style>