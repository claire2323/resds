<template>
	<view class="employee-container">
		<uni-nav-bar dark :fixed="true" background-color="#3b7cff" status-bar title="员工端首页" />

		<!-- 个人信息区域 -->
		<view class="user-info-section">
			<view class="user-avatar">
				<image :src=avatar mode="aspectFill" @click="handleToAvatar"></image>
			</view>
			<view class="user-details">
				<view class="user-name">用户名：{{username}}</view>
				<text class="user-phone">手机号：{{phoneNum}}</text>
				<view class="company-name">商店名称：{{storeName}}</view>
			</view>
		</view>

		<!-- 统计数据区域 -->
		<view class="stats-card">
			<view class="stats-header">
				<text class="stats-title">
					<text class="iconfont icon-chart"></text> 订单统计
				</text>
				<text class="stats-more" @click="goToStatistics">查看 ></text>
			</view>
			<view class="stats-content">
				<view class="stats-item">
					<text class="stats-value">{{todayOrder}}个</text>
					<text class="stats-label">今日完成订单</text>
				</view>
				<view class="stats-item">
					<text class="stats-value">{{MonthOrder}}个</text>
					<text class="stats-label">本月完成订单</text>
				</view>
				<view class="stats-item">
					<text class="stats-value">{{allOrder}}个</text>
					<text class="stats-label">累计完成订单</text>
				</view>
			</view>
		</view>

		<!-- 订单选项卡 -->
		<view class="order-tabs">
			<view class="tab-item" :class="{active: activeTab === 'AWAIT_ACCEPT'}"
				@click="handleTabClick('AWAIT_ACCEPT')">
				待接单({{pendingCount || 0}})
			</view>
			<view class="tab-item" :class="{active: activeTab === 'AWAIT_DROP_IN'}"
				@click="handleTabClick('AWAIT_DROP_IN')">
				待服务({{processingCount || 0}})
			</view>
			<view class="tab-item" :class="{active: activeTab === 'SERVICE_FINISH'}"
				@click="handleTabClick('SERVICE_FINISH')">
				已完成({{completedCount || 0}})
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list" v-if="activeTab">
			<!-- 空状态提示 -->
			<view class="empty-hint" v-if="orderList.length === 0 && !isLoading">
				<text>暂无{{ getStatusText(activeTab) }}订单</text>
			</view>

			<!-- 订单卡片 -->
			<view class="order-item" v-for="(item, index) in orderList" :key="index" @click="toOrderDetail(item.id)">
				<view class="order-header">
					<text class="order-no">订单编号：{{item.code}}</text>
					<text class="order-status">{{getStatusText(item.orderState)}}</text>
				</view>

				<view class="order-row">
					<text class="order-label">服务名称：</text>
					<text class="order-value">{{item.serviceName}}</text>
				</view>
				<view class="order-row">
					<text class="order-label">联系电话：</text>
					<text class="order-value">{{item.phone}}</text>
				</view>
				<view class="order-row">
					<text class="order-label">服务地址：</text>
					<text class="order-value">{{item.serviceAddr}}</text>
				</view>
				<view class="order-row">
					<text class="order-label">申请时间：</text>
					<text class="order-value">{{item.serviceTime}}</text>
				</view>
				<view class="order-row">
					<text class="order-label">订单金额：</text>
					<text class="order-value">¥{{item.orderMoney}}</text>
				</view>

				<!-- 根据不同状态显示不同的按钮 -->
				<view class="order-actions">
					<!-- 待接单状态显示两个按钮 -->
					<template v-if="item.orderState === 'AWAIT_ACCEPT'">
						<button class="contact-btn" @click.stop="contactCustomer(item.phone)">联系客户</button>
						<button class="start-btn" @click.stop="startService(item.id)">扫描消费码</button>
					</template>

					<!-- 待服务状态显示一个按钮 -->
					<template v-else-if="item.orderState === 'AWAIT_DROP_IN'">
						<button class="start-btn" @click.stop="completeService(item.id)">完成服务</button>
					</template>

					<!-- 待回访状态显示两个按钮 -->
					<template v-else-if="item.orderState === 'SERVICE_FINISH'">
						<button class="contact-btn" @click.stop="contactCustomer(item.phone)">联系客户</button>
						<button class="start-btn" @click.stop="completeVisit(item.id)">完成回访</button>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getserviceOrderHome
	} from '@/api/login.js'
	import {
		getOrderList
	} from '@/api/order/index.js'

	export default {
		data() {
			return {
				storeNum: '',
				serviceNum: '',
				finishNum: '',
				storeName: '',
				username: '',
				phoneNum: '',
				storeId: '',
				allOrder: '',
				MonthOrder: '0',
				todayOrder: '',
				activeTab: '',
				orders: [],
				orderList: [],
				isLoading: false,
				pendingCount: 0,
				processingCount: 0,
				completedCount: 0
			}
		},
		methods: {
			goToStatistics() {
				uni.navigateTo({
					url: '/pages/employee/statistic'
				});
			},
			goBack() {
				uni.navigateBack();
			},
			handleTabClick(state) {
				this.activeTab = state;
				
				// 调用loadOrdersByState()不带参数
				this.loadOrdersByState();
				// 或者如果已经有数据，直接前端过滤也可以
				// this.orderList = this.allOrders.filter(order => order.orderState === state);
			},
			async loadOrdersByState() {
				this.isLoading = true;
				uni.showLoading({
					title: '加载中'
				});

				try {
					// 不传orderState参数，获取所有订单
					const { data, code } = await getOrderList('SERVICE', { 
						// 可以保留其他必要参数
						storeId: this.storeId
					});
					
					if (code === 200) {
						// 获取所有订单数据
						const allOrders = data.list || [];
						
						// 前端根据activeTab筛选显示对应状态的订单
						this.orderList = allOrders.filter(order => order.orderState === this.activeTab);
						
						// 计算各状态订单数量
						this.pendingCount = allOrders.filter(order => order.orderState === 'AWAIT_ACCEPT').length;
						this.processingCount = allOrders.filter(order => order.orderState === 'AWAIT_DROP_IN').length;
						this.completedCount = allOrders.filter(order => order.orderState === 'SERVICE_FINISH').length;
						
					} else {
						uni.showToast({
							title: res.msg || '获取数据失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取订单数据失败', error);
					uni.showToast({
						title: '网络异常，请稍后重试',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
					uni.hideLoading();
				}
			},
			getStatusText(status) {
				const statusMap = {
					'AWAIT_ACCEPT': '待接单',
					'AWAIT_DROP_IN': '待服务',
					'SERVICE': '服务中',
					'SERVICE_FINISH': '已完成',
					'REQUEST_REFUND': '待回访'
				};
				return statusMap[status] || '未知状态';
			},
			toOrderDetail(id) {
				uni.navigateTo({
					url: `/pages/order/detail?id=${id}`
				});
			},
			contactCustomer(phone) {
				if (phone) {
					uni.makePhoneCall({
						phoneNumber: phone
					});
				} else {
					uni.showToast({
						title: '电话号码不可用',
						icon: 'none'
					});
				}
			},
			startService(id) {
				// 修改为打开扫码页面
				uni.navigateTo({
					url: `/pages/employee/scan?orderId=${id}`
				});
			},
			completeService(id) {
				// 处理完成服务的逻辑
			},
			completeVisit(id) {
				// 处理完成回访的逻辑
			},
			handleToAvatar() {
				uni.navigateTo({
					url: '/pages/mine/index'
				})
			},
			async TogetstoreOrderHome() {
				const {
					code,
					data
				} = await getserviceOrderHome('SERVICE');
				console.log(data)
				if (code === 200) {
					this.storeNum = data.djd;
					this.serviceNum = data.dfw;
					this.finishNum = data.ywc;
					this.storeName = data.storeName,
						this.username = data.userName,
						this.phoneNum = data.phone,
						this.storeId = data.storeId,
						this.allOrder = data.allOrder,
						this.monthOrder = data.monthOrder,
						this.todayOrder = data.todayOrder
					// console.log(typeof(this.storeId))
				}
			},
		},
		created() {
			this.TogetstoreOrderHome(),
				this.handleTabClick('AWAIT_ACCEPT')
		},
		computed: {
			avatar() {
				return this.$store.state.user.avatar
			},
		}
	}
</script>

<style lang="scss">
	.employee-container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	/* 自定义导航栏 */
	.custom-navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 160rpx;
		padding-top: var(--status-bar-height);
		background: linear-gradient(to right, #3b7cff, #3b7cff);
		padding-left: 30rpx;
		padding-right: 30rpx;
		color: #fff;

		.navbar-left,
		.navbar-right {
			display: flex;
			align-items: center;
		}

		.navbar-title {
			font-size: 34rpx;
			font-weight: 500;
		}

		.navbar-right {
			.iconfont {
				margin-left: 30rpx;
				font-size: 40rpx;
			}
		}
	}

	/* 用户信息区域 */
	.user-info-section {
		background: linear-gradient(to right, #3b7cff, #3b7cff);
		padding: 40rpx 30rpx 60rpx;
		color: #fff;
		display: flex;
		align-items: center;

		.user-avatar {
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
			background-color: #fff;
			overflow: hidden;
			margin-right: 40rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.user-details {
			flex: 1;

			.user-name {
				font-size: 32rpx;
				font-weight: 500;
				margin-bottom: 6rpx;

				.user-phone {
					font-size: 26rpx;
					font-weight: normal;
					margin-left: 15rpx;
				}
			}

			.company-name {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}
	}

	/* 统计卡片 */
	.stats-card {
		margin: -30rpx 30rpx 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 30rpx;

		.stats-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.stats-title {
				color: #333;
				font-size: 28rpx;
				font-weight: 500;

				.iconfont {
					color: #3b7cff;
					margin-right: 8rpx;
				}
			}

			.stats-more {
				color: #3b7cff;
				font-size: 24rpx;
			}
		}

		.stats-content {
			display: flex;
			justify-content: space-between;

			.stats-item {
				flex: 1;
				text-align: center;

				.stats-value {
					display: block;
					color: #3b7cff;
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}

				.stats-label {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	/* 订单选项卡 */
	.order-tabs {
		display: flex;
		background-color: #fff;
		margin: 0 30rpx;
		border-radius: 50rpx;
		overflow: hidden;

		.tab-item {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			color: #666;
			transition: all 0.3s;

			&.active {
				background-color: #3b7cff;
				color: #fff;
			}
		}
	}

	/* 订单列表 */
	.order-list {
		padding: 30rpx;

		.empty-hint {
			font-size: 26rpx;
			padding-left: 260rpx;
			padding-top: 120rpx;
			margin: 0, auto;
		}

		.order-item {
			background-color: #fff;
			border-radius: 15rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				
				.order-no {
					font-size: 28rpx;
					color: #333;
				}
				
				.order-status {
					font-size: 28rpx;
					color: #3b7cff;
					font-weight: 500;
					background-color: rgba(59, 124, 255, 0.1);
					padding: 6rpx 16rpx;
					border-radius: 20rpx;
				}
			}

			.order-row {
				display: flex;
				margin-bottom: 15rpx;
				font-size: 28rpx;

				.order-label {
					color: #666;
					width: 180rpx;
				}

				.order-value {
					flex: 1;
					color: #333;
				}
			}

			.order-actions {
				display: flex;
				justify-content: flex-end;
				margin-top: 30rpx;

				button {
					margin: 0 0 0 20rpx;
					font-size: 28rpx;
					height: 70rpx;
					line-height: 70rpx;
					padding: 0 40rpx;
					border-radius: 35rpx;
				}

				.contact-btn {
					background: linear-gradient(to right, #6e7bff, #7b5bff);
					color: #fff;
				}

				.start-btn {
					background: linear-gradient(to right, #3b7cff, #7b5bff);
					color: #fff;
				}
			}
		}
	}

	/* 图标字体 */
	@font-face {
		font-family: 'iconfont';
		src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAOQAAsAAAAAB7gAAANEAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqDFIJxATYCJAMMCwgABCAFhG0HNRsIBsgOJQkJIkAEEETgefj//f7aZ+59RJPEonkeiSaJJolM0tHEI5FIhkRCh0QjJPcfdrXfSAO5FTUr4gfZQzZk5R6VO1M5CpmZpDPp4v9cTr0GlA/UluUyxqAPHPUC2hjXRVlAAnJDjFtGexmPCTQb5iC2VtS1gKvCGBWIU4okwTWlVDmGYVqoC2YW8QSVadIIegTwGP998Y8oXElqmTHb9pyUDeTQ1o/l5T+SlMRxjNPZiLGIwrgwGz8LGcYXGpqXPUzsoKkpB87fehn88mj/8RCRKoN5u0DG4pGNnwMeQhR+YOSAVrJ1fZLr94K+3PNm1dLa4WhBTXHlxGZlL+yqaOfz+lc7h64ePr4Wbo7WueLm9p7bxbUD1w9Wrh+6ujk2CzdHKzM1PVOXryAu4M/WvVq1bvmSvstXbp7bG71KXZufv/Jq+7ZfFo5fmj2Zi6fqP7ub3YYXLclfU81vlTq4c/p6D9RbMnPHnmk9VWG6K7as3NJT0ySc0DmwNLtu945lZ0Kt1qNzlp2WLTM7LVVdLMvOyU5VdXcz1Q6yg6Jc8VfcouUd8rP0/2Xf9YM5Pfj88xn9PaJLpZ70kB7UD2VnddX35b1bM2fW5uysXjNzblt9y7w53VVrqrsGdbS3Nta0tO4BPP9vsZDTUdDijxRU/OOPJL0wwO+NnOzPQP8S8IvB+0vqfwm+D9DL8Uf5t3HnG/jdGa/5f+IEwL82TYJf1RJUeYa21AEoGlHGX9bKglSxTM3idC0uF6kHUU8cBprxmQzLxk9VX0JDg2qISobBkBpG2YJchMpMEerSKmie4TdnU0dMZBSw4MwC0GYtJG2eINbmHluQz1DZ5xvq2pZB8x5hL9i0PQ5FVRjJbGAOuY+1sVb5Ij5Tyj5Ky0Q8xBehvDJK9klrqQgTsSuuYR4eYeKYCDdwEawqFHpYvQ772OzcKKvKa0qJr0JvPUVTZxiRqQHGQdyHaUZNJclXms+nSJkPRRsseVS+EJRbUiR+NQ1SR6kQrZXUquvlzYMjmHCYEFwDF4JaWhTQA4v6aLJjZs4Yoz7kayQpYq8i1Fa5frB5i9ugGRypkTKDgN2tGQAAAA==') format('woff2');
		font-weight: normal;
		font-style: normal;
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-back:before {
		content: "\e697";
	}

	.icon-more:before {
		content: "\e698";
	}

	.icon-search:before {
		content: "\e699";
	}

	.icon-chart:before {
		content: "\e696";
	}
</style>