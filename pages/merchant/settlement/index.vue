<template>
	<view class="over-detail-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" 
			shadow 
			background-color="#3b7cff" 
			status-bar 
			left-icon="left"
			left-text="返回"
			title="订单统计" 
			@clickLeft="back" />

		<!-- 筛选区域 -->
		<view class="filter-section">
			<view class="filter-row">
				<uni-data-select
					v-model="queryParams.serviceType"
					:localdata="serve_state"
					@change="handleFilter"
					placeholder="服务类型"
					class="filter-item"
				/>
				<uni-data-select
					v-model="queryParams.orderStatus"
					:localdata="order_state"
					@change="handleFilter"
					placeholder="订单状态"
					class="filter-item"
				/>
				<uni-data-select
					v-model="queryParams.timeRange"
					:localdata="begain_time"
					@change="handleFilter"
					placeholder="接单时间"
					class="filter-item"
				/>
			</view>
		</view>

		<!-- 统计信息 -->
		<view class="stats-card">
			<view class="stats-item">
				<text class="label">订单金额</text>
				<text class="value">¥{{ statistics.orderAmount }}</text>
			</view>
			<view class="stats-item">
				<text class="label">结算金额</text>
				<text class="value">¥{{ statistics.settleAmount }}</text>
			</view>
			<view class="stats-item">
				<text class="label">记录数</text>
				<text class="value">{{ statistics.recordCount }}条</text>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view v-for="order in orderList" :key="order.orderNo" class="order-card">
				<view class="order-header">
					<text class="order-number">订单编号：{{ order.code }}</text>
					<text class="status" :class="getStatusClass(order.orderState)">
						{{ getStatusText(order.orderState) }}
					</text>
				</view>
				<view class="order-content">
					<view class="info-item">
						<text class="label">服务名称：</text>
						<text class="value">{{ order.serviceName }}</text>
					</view>
					<view class="info-item">
						<text class="label">数量：</text>
						<text class="value">{{ order.serviceNum }}</text>
					</view>
					<view class="info-item">
						<text class="label">服务地址：</text>
						<text class="value">{{ order.serviceAddr }}</text>
					</view>
					<view class="info-item">
						<text class="label">接单时间：</text>
						<text class="value">{{ order.serviceTime }}</text>
					</view>
					<view class="info-item">
						<text class="label">订单金额：</text>
						<text class="value price">¥{{ order.orderMoney }}</text>
					</view>
					<view class="info-item">
						<text class="label">结算金额：</text>
						<text class="value price">¥{{ order.serviceMoney }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getOrderStatistics } from '@/api/business/index.js'

export default {
	data() {
		return {
			// 查询参数
			queryParams: {
				serviceType: '',
				orderStatus: '',
				timeRange: ''
			},
			// 服务类型选项
			serve_state: [
				{ value: 1, text: "助洁" },
				{ value: 2, text: "助餐" },
				{ value: 3, text: "助医" }
			],
			// 订单状态选项
			order_state: [
				{ text: '待派单', value: 1 },
				{ text: '已完成', value: 2 },
				{ text: '待接单', value: 3 },
				{ text: '待上门', value: 4 },
				{ text: '待服务', value: 5 },
				{ text: '服务中', value: 6 },
				{ text: '取消订单', value: 7 },
			],
			// 时间范围选项
			begain_time: [
				{ text: '今日', value: 'TIME_TODAY' },
				{ text: '本周', value: 'TIME_WEEK' },
				{ text: '本月', value: 'TIME_MONTH' },
				{ text: '上个月', value: 'TIME_LAST_MONTH' },
				{ text: '半年', value: 'TIME_HALF_YEAR' },
				{ text: '一年',value:'TIME_NEARLY_YEAR'}
			],
			// 订单列表
			orderList: [],
			// 统计信息
			statistics: {
				orderAmount: '0.00',
				settleAmount: '0.00',
				recordCount: 0
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		// 获取列表数据
		async getList(customParams) {
			try {
				// 显示加载中
				uni.showLoading({
					title: '加载中...'
				})
				
				// 使用传入的自定义参数或根据接口文档构建正确的参数
				const params = customParams || {
					serviceTypeId: this.queryParams.serviceType || '',
					orderState: this.queryParams.orderStatus || '',
					timeFlag: this.queryParams.timeRange || ''
				}
				
				// console.log('请求参数:', params) // 调试用
				
				// 检查订单状态值是否需要转换
				// 根据接口文档中的可用值进行转换
				if (params.orderState) {
					// 将数字值转换为接口期望的字符串值
					switch (parseInt(params.orderState)) {
						case 1:
							params.orderState = 'AWAIT_DISTRIBUTION_SERVICE'; // 待接单
							break;
						case 2:
							params.orderState = 'DISTRIBUTION_STORE'; // 已完成
							break;
						case 3:
							params.orderState = 'AWAIT_ACCEPT'; // 待结算
							break;
						case 4:
							params.orderState = 'AWAIT_DISTRIBUTION_STORE'; // 待结算
							break;
						case 5:
							params.orderState = 'AWAIT_DROP_IN'; // 待结算
							break;
						case 6:
							params.orderState = 'SERVICE'; // 待结算
							break;
						case 7:
							params.orderState = 'CANCEL_ORDER'; // 待结算
							break;
						default:
							break;
					}
				}
				
				// console.log('转换后的请求参数:', params) // 调试用
				
				const res = await getOrderStatistics('STORE',params)
				// console.log('API响应:', res) // 调试用
				
				// 隐藏加载中
				uni.hideLoading()
				
				if (res && res.code === 200) {
					const { data } = res
					if (data) {
						this.orderList = data.list || []
						this.statistics = {
							orderAmount: data.orderMoney || '0.00',
							settleAmount: data.orderSettlementMoney || '0.00',
							recordCount: data.num || 0
						}
					} else {
						this.resetData()
					}
				} else {
					this.resetData()
					uni.showToast({
						title: res?.msg || '获取数据失败',
						icon: 'none'
					})
				}
			} catch (error) {
				// 隐藏加载中
				uni.hideLoading()
				
				console.error('获取结算明细失败:', error)
				this.resetData()
				uni.showToast({
					title: '获取数据失败',
					icon: 'none'
				})
			}
		},
		// 筛选条件变更
		handleFilter() {
			// console.log('筛选条件变更:', this.queryParams) // 调试用
			
			// 确保参数名称与接口文档一致
			const params = {
				serviceTypeId: this.queryParams.serviceType || '',
				orderState: this.queryParams.orderStatus || '',
				timeFlag: this.queryParams.timeRange || ''
			}
			
			// console.log('发送参数:', params) // 调试用
			this.getList(params)
		},
		// 获取状态样式类
		getStatusClass(status) {
			const statusMap = {
				AWAIT_DISTRIBUTION_SERVICE: 'pending',
				DISTRIBUTION_STORE: 'success',
				AWAIT_ACCEPT: 'paused'
			}
			return statusMap[status]
		},
		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				AWAIT_DISTRIBUTION_SERVICE: '待派单',
				DISTRIBUTION_STORE: '已完成',
				AWAIT_ACCEPT: '待接单',
				AWAIT_DISTRIBUTION_STORE:"待上门",
				AWAIT_DROP_IN:"待服务",
				SERVICE : "服务中",
				CANCEL_ORDER :'取消订单'
			}
			return statusMap[status]
		},
		// 返回
		back() {
			uni.navigateBack()
		},
		// 重置数据
		resetData() {
			this.orderList = []
			this.statistics = {
				orderAmount: '0.00',
				settleAmount: '0.00',
				recordCount: 0
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.over-detail-container {
	min-height: 100vh;
	background-color: #f5f7fa;
}

.filter-section {
	background: #fff;
	padding: 20rpx 30rpx;
	margin-bottom: 20rpx;

	.filter-row {
		display: flex;
		gap: 20rpx;

		.filter-item {
			flex: 1;
		}
	}
}

.stats-card {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;

	.stats-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.label {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 8rpx;
		}
		
		.value {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}
	}
}

.order-list {
	// padding: 0 30rpx;
}

.order-card {
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;

		.order-number {
			font-weight: bold;
			font-size: 28rpx;
			color: #333;
		}

		.status {
			font-size: 24rpx;
			padding: 4rpx 16rpx;
			border-radius: 6rpx;

			&.pending {
				background: #e8f3ff;
				color: #3b7cff;
			}

			&.success {
				background: #e7f8f3;
				color: #00b578;
			}

			&.paused {
				background: #fff3e5;
				color: #ff9f1c;
			}
		}
	}

	.order-content {
		.info-item {
			display: flex;
			margin-bottom: 16rpx;

			.label {
				font-size: 28rpx;
				color: #666;
				width: 160rpx;
			}

			.value {
				flex: 1;
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
</style>