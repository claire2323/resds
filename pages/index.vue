<template>
	<view class="index-container">
		<!-- 头部区域 -->
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar title="首页">
		</uni-nav-bar>

		<!-- 头部信息区域 -->
		<view class="header-section">
			<!-- 通知栏 -->
			<view class="notice-section">
				<uni-notice-bar show-icon scrollable :text="noticeText" background-color="rgba(255,255,255,0.9)"
					color="#3b7cff" />
			</view>

			<!-- 用户信息 -->
			<view class="user-info">
				<view class="avatar-info" @click="handleToAvatar">
					<image v-if="avatar" :src="avatar" class="avatar" mode="aspectFill"></image>
				</view>
				
				<view class="user-text">
					<text class="company-name">{{storeName}}</text>
					<text class="contact-info">{{phoneNum}} ({{username}})</text>
				</view>
				<view class="scan-btn-header" @click="handleScan">
					<image src="/static/svg/scan.svg" mode="aspectFit" class="scan-icon-header"></image>
				</view>
			</view>
		</view>

		<!-- 收入统计区域 -->
		<view class="account-section">
			<view class="statistic-row">
				<view class="statistic-item">
					<text class="amount">¥{{allAmount?allAmount:0}}</text>
					<text class="label">总收入</text>
				</view>
				<view class="divider"></view>
				<view class="statistic-item">
					<text class="amount">¥{{monthAmount?monthAmount:0}}</text>
					<text class="label">本月收入</text>
				</view>
				<view class="divider"></view>
				<view class="statistic-item">
					<text class="amount">¥{{lastMonthAmount?lastMonthAmount:0}}</text>
					<text class="label">上月收入</text>
				</view>
			</view>
		</view>

		<!-- 订单状态区域 -->
		<view class="order-status">
			<view class="icon-section" @click="goOreder('AWAIT_DISTRIBUTION_SERVICE')">
				<view class="badge-container">
					<uni-badge class="uni-badge-left-margin" :text="packetNum" absolute="rightTop" :offset="[-5, 0]"
						size="small">
						<image :src="svgIcon7" class="svg-section" mode="aspectFit"></image>
					</uni-badge>
				</view>
				<text>待派单</text>
			</view>
			<view class="icon-section" @click="goOreder('AWAIT_ACCEPT')">
				<view class="badge-container">
					<uni-badge class="uni-badge-left-margin" :text="storeNum" absolute="rightTop" :offset="[-5, 0]"
						size="small">
						<image :src="svgIcon2" class="svg-section" mode="aspectFit"></image>
					</uni-badge>
				</view>
				<text>待接单</text>
			</view>
			<view class="icon-section" @click="goOreder('AWAIT_DISTRIBUTION_STORE')">
				<view class="badge-container">
					<uni-badge class="uni-badge-left-margin" :text="serviceNum" absolute="rightTop" :offset="[-5, 0]"
						size="small">
						<image :src="svgIcon3" class="svg-section" mode="aspectFit"></image>
					</uni-badge>
				</view>
				<text>待上门</text>
			</view>
			<view class="icon-section" @click="goOreder('SERVICE')">
				<view class="badge-container">
					<image :src="svgIcon6" class="svg-section" mode="aspectFit"></image>
				</view>
				<text>服务中</text>
			</view>
			<view class="icon-section" @click="goOreder('')">
				<image :src="svgIcon5" class="svg-section" mode="aspectFit"></image>
				<text>全部订单</text>
			</view>
		</view>

		<!-- 功能区域 -->
		<view class="feature-section">
			<view class="feature-grid">
				<view class="feature-item" v-for="(item, index) in features" :key="index"
					@click="handleFeatureClick(item)">
					<view class="feature-icon">
						<image :src="item.icon" mode="aspectFit" class="icon-blue"></image>
					</view>
					<text class="feature-text">{{ item.name }}</text>
				</view>
				<view class="feature-item" @click="showServiceManageDialog">
					<view class="feature-icon">
						<image src="/static/svg/guanli.svg" mode="aspectFit" class="icon-blue"></image>
					</view>
					<text class="feature-text">服务管理</text>
				</view>
			</view>
		</view>

		<!-- 页脚区域 -->
		<view class="footer">
			<image :src="contactIcon" mode="aspectFit"></image>
			<text>服务热线：400 5585 3624</text>
		</view>
	</view>
</template>

<script>
	import {
		getOrderList
	} from '@/api/order/index.js'
	import {
		IndexCount
	} from '@/api/system/user.js'
	import {
		getstoreOrderHome
	} from '@/api/login.js'
	export default {
		data() {
			return {
				// avatar: '/static/images/line.jpeg',
				noticeText: '沙坪坝区xxx小区需助医服务,请及时接单>',
				phoneNum: '',
				username: '',
				storeId: '',
				storeName: '',
				allAmount: 0,
				monthAmount: '',
				lastMonthAmount: '',
				svgIcon2: '/static/svg/u1.svg',
				svgIcon3: '/static/svg/shangmen.svg',
				svgIcon5: '/static/svg/u4.svg',
				svgIcon6: '/static/svg/service.svg',
				svgIcon7: '/static/svg/zidongpaidan.svg',
				img1: '/static/images/phone.png',
				contactIcon: '/static/svg/contact.svg',
				serviceNum: 0,
				packetNum: 0,
				storeNum: 0,
				features: [{
						name: '订单统计',
						icon: '/static/svg/order.svg',
						url: '/pages/merchant/settlement/index',
						roles: ['ALL']
					},
					{
						name: '结算明细',
						icon: '/static/svg/jiesuan.svg',
						url: '/pages/business/overDetail',
						roles: ['ALL']
					},
					{
						name: '提现管理',
						icon: '/static/svg/tixian.svg',
						url: '/pages/cash/index',
						roles: ['ALL']
					},
					{
						name: '门店信息',
						icon: '/static/svg/zhuce.svg',
						url: '/pages/business/detail',
						roles: ['STORE']
					},
					{
						name: '员工管理',
						icon: '/static/svg/yuangong.svg',
						url: '/pages/people/manage',
						roles: ['STORE']
					}
				]
			}
		},
		methods: {
			handleFeatureClick(item) {
				if (item.url) {
					if (item.name === '员工管理') {
						uni.navigateTo({
							url: `${item.url}?storeId=${this.storeId}`
						});
					} else {
						uni.navigateTo({
							url: item.url
						});
					}
				}
			},
			goOreder(state) {
				uni.navigateTo({
					url: `/pages/business/statistic?orderState=${state}`,
				});
			},
			goInfomation() {
				uni.navigateTo({
					url: '/pages/business/detail',
					params: {

					}
				});
			},
			goDone() {
				uni.navigateTo({
					url: '/pages/business/overDetail',
				});
			},
			managePeople() {
				uni.navigateTo({
					url: '/pages/people/manage',
					params: {

					}
				});
			},
			goCash() {
				uni.navigateTo({
					url: '/pages/cash/index',
				});
			},
			// 添加服务管理弹窗方法
			showServiceManageDialog() {
				uni.showModal({
					title: '温馨提示',
					content: '请联系管理员在后台添加服务',
					confirmText: '知道了',
					showCancel: false,
					confirmColor: '#3b7cff',
					success: (res) => {
						if (res.confirm) {
							// console.log('用户确认了服务管理提示');
						}
					}
				});
			},

			async TogetstoreOrderHome() {
				const {
					code,
					data
				} = await getstoreOrderHome('STORE');
				console.log(data)
				if (code === 200) {
					this.storeNum = data.djd;
					this.serviceNum = data.dsm;
					this.packetNum = data.dpd;
					this.storeName = data.storeName,
					this.username = data.userName,
					this.phoneNum = data.phone,
					this.storeId = data.storeId,
					this.allAmount = data.allAmount,
					this.monthAmount = data.monthAmount,
					this.lastMonthAmount = data.lastMonthAmount
				}
			},
			handleToAvatar() {
				uni.navigateTo({
					url: `/pages/mine/index?username=${this.username}&storeId=${this.storeId}`
				})
			},
			handleScan() {
				uni.navigateTo({
					url: '/pages/scan/scan'
				})
			},
		},
		created() {
			this.TogetstoreOrderHome()
			// console.log(this.$store.state.user.roles)
		},
		computed: {
			avatar() {
				return this.$store.state.user.avatar
			},
		},
	}
</script>

<style lang="scss" scoped>
	// 定义主题颜色变量
	$primary-color: #07C160;
	$secondary-color: #059E4D; // 辅助颜色，用于强调和过渡
	$text-gray: #666;
	$bg-light-gray: #f4f4f4;
	$white: #fff;

	// 整体容器
	.index-container {
		min-height: 100vh;
		background-color: #f5f7fa;
	}

	// 头部区域
	.header-section {
		background: linear-gradient(120deg, #3b7cff, #6c47ff);
		padding: 20rpx 30rpx 40rpx;
		color: #fff;

		.notice-section {
			margin-bottom: 30rpx;
		}

		.user-info {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.avatar-info {
				.avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 60rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.3);
				}
			}

			.scan-btn-header {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.scan-icon-header {
					width: 44rpx;
					height: 44rpx;
					filter: brightness(0) invert(1); // 使图标变为白色
				}
			}

			.user-text {
				flex: 1;
				.company-name {
					font-size: 36rpx;
					font-weight: 600;
					margin-bottom: 10rpx;
					display: block;
				}

				.contact-info {
					font-size: 26rpx;
					opacity: 0.9;
				}
			}
		}
	}

	// 收入区域
	.account-section {
		margin: -40rpx 30rpx 0;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.statistic-row {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.statistic-item {
				flex: 1;
				text-align: center;

				.amount {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					display: block;
					margin-bottom: 10rpx;
				}

				.label {
					font-size: 24rpx;
					color: #666;
				}
			}

			.divider {
				width: 2rpx;
				height: 50rpx;
				background: #eee;
			}
		}
	}

	// 状态区域
	.order-status {
		background-color: $white;
		border-radius: 15rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
		padding: 30rpx;
		margin: 30rpx 30rpx;
		display: flex;
		justify-content: space-around;
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5rpx);
			box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.15);
		}

		.icon-section {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			width: 33.33%;

			.svg-section {
				width: 70rpx;
				height: 70rpx;
				margin-bottom: 15rpx;
				fill: $primary-color; // 设置图标颜色
				transition: fill 0.3s ease; // 图标颜色过渡

				&:hover {
					fill: $secondary-color;
				}
			}

			.badge-container {
				position: relative;
			}
		}
	}

	// 功能区域
	.feature-section {
		margin: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.feature-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 30rpx;

			.feature-item {
				text-align: center;

				.feature-icon {
					width: 100rpx;
					height: 100rpx;
					margin: 0 auto 10rpx;
					background: rgba(59, 124, 255, 0.1);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 60rpx;
						height: 60rpx;
					}

					.icon-blue {
						filter: brightness(0) saturate(100%) invert(45%) sepia(90%) saturate(1304%) hue-rotate(204deg) brightness(99%) contrast(107%);
					}
				}

				.feature-text {
					font-size: 24rpx;
					color: #333;
				}
			}
		}
	}

	// 页脚区域
	.footer {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		gap: 10rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}

		text {
			font-size: 26rpx;
			color: #666;
		}
	}

	.scan-btn {
		padding: 0 20rpx;
		.scan-icon {
			width: 44rpx;
			height: 44rpx;
			filter: brightness(0) invert(1); // 使图标变为白色
		}
	}
</style>