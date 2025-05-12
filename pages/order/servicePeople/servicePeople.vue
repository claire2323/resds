<template>
	<view class="service-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" left-text="返回"
			title="指派服务人员" @clickLeft="uniback" />

		<!-- 订单信息卡片 -->
		<view class="order-card">
			<view class="order-header">
				<text class="order-title">订单信息</text>
				<text class="order-number">订单编号：{{code}}</text>
			</view>
			<view class="order-tip">
				<text class="iconfont icon-info"></text>
				<text>请选择上门服务人员</text>
			</view>
		</view>

		<!-- 人员列表 -->
		<view class="staff-list">
			<view class="staff-card" v-for="(item, index) in spList" :key="index"
				:class="{'staff-active': curIndex === index}" @click="choseItem(index, item.id)">
				<view class="staff-info">
					<view class="staff-avatar">
						<text class="avatar-text">{{item.name.substr(0,1)}}</text>
					</view>
					<view class="staff-details">
						<text class="staff-name">{{item.name}}</text>
						<view class="staff-tags">
							<text class="tag">{{item.gender==0?'女':'男'}}</text>
							<text class="tag">{{item.staffNumber}}</text>
						</view>
					</view>
				</view>
				<view class="select-icon" v-if="curIndex === index">
					<text class="iconfont icon-check"></text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-button">
			<button class="submit-btn" @click="toSp" :disabled="servicePeopleId === null" hover-class="btn-hover">
				确认派单
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.service-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 140rpx;
	}

	.order-card {
		margin: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.order-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.order-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.order-number {
				font-size: 26rpx;
				color: #666;
			}
		}

		.order-tip {
			display: flex;
			align-items: center;
			gap: 10rpx;
			color: #3b7cff;
			font-size: 28rpx;

			.iconfont {
				font-size: 32rpx;
			}
		}
	}

	.staff-list {
		padding: 0 30rpx;
	}

	.staff-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		border: 2rpx solid transparent;
		transition: all 0.3s;

		&.staff-active {
			background: rgba(59, 124, 255, 0.05);
			border-color: #3b7cff;
		}

		.staff-info {
			display: flex;
			align-items: center;
			gap: 20rpx;
		}

		.staff-avatar {
			width: 88rpx;
			height: 88rpx;
			background: linear-gradient(120deg, #3b7cff, #6c47ff);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.avatar-text {
				color: #fff;
				font-size: 36rpx;
				font-weight: bold;
			}
		}

		.staff-details {
			.staff-name {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
				margin-bottom: 12rpx;
				display: block;
			}

			.staff-tags {
				display: flex;
				gap: 12rpx;

				.tag {
					font-size: 22rpx;
					color: #3b7cff;
					background: rgba(59, 124, 255, 0.1);
					padding: 4rpx 16rpx;
					border-radius: 20rpx;
				}
			}
		}

		.select-icon {
			width: 44rpx;
			height: 44rpx;
			background: #3b7cff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.iconfont {
				color: #fff;
				font-size: 28rpx;
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
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.submit-btn {
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

		&[disabled] {
			background: #ccc;
			opacity: 0.8;
		}
	}

	.btn-hover {
		transform: scale(0.98);
		opacity: 0.9;
	}
</style>

<script>
	import {
		toast
	} from '@/utils/common'
	import {
		getSpList,
		toServicePeople
	} from '@/api/order/index.js'
	export default {
		data() {
			return {
				spList: [],
				curIndex: -1,
				id: null,
				servicePeopleId: null,
				code: null
			}
		},
		methods: {
			choseItem(index, id) {
				this.curIndex = index
				this.servicePeopleId = id
			},

			async servicePeople() {
				const {
					code,
					data
				} = await getSpList()
				// console.log(data)
				if (code == 200) {
					this.spList = [...data.rows]
				}
			},

			async toSp() {
				if (!this.servicePeopleId) {
					toast('请选择服务人员')
					return
				}

				const {
					code,
					msg
				} = await toServicePeople({
					id: this.id,
					servicePeopleId: this.servicePeopleId
				})

				if (code == 200) {
					toast(msg)
					uni.navigateTo({
						url: '/pages/index',
					});
				}
			},

			uniback() {
				uni.navigateBack()
			}
		},

		created() {
			// 获取服务人员列表
			this.servicePeople()
		},
		onLoad(options) {
			this.id = options.id
			this.code = options.code
		}
	}
</script>