<template>
	<view class="detail-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" 
			shadow 
			background-color="#3b7cff" 
			status-bar 
			left-icon="left"
			left-text="返回"
			title="商家信息" 
			@clickLeft="back" />

		<!-- 基础信息卡片 -->
		<view class="info-card" v-if="storeInfo">
			<view class="card-title">
				<text>基础信息</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">商家名称</text>
					<text class="value">{{ storeInfo.storeName || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">手机号码</text>
					<text class="value">{{ storeInfo.contactPhone || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">联系人</text>
					<text class="value">{{ storeInfo.contactPerson || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">门店地址</text>
					<text class="value">{{ storeInfo.address || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">认证状态</text>
					<text class="value status-tag" :class="storeInfo.authStatus === 1 ? 'success' : ''">
						{{ storeInfo.authStatus === 1 ? '已认证' : '未认证' }}
					</text>
				</view>
				<view class="info-item">
					<text class="label">服务状态</text>
					<text class="value status-tag" :class="storeInfo.status === 0 ? 'primary' : ''">
						{{ storeInfo.status === 0	 ? '上线' : '下线' }}
					</text>
				</view>
			</view>
		</view>

		<!-- 银行账号信息卡片 -->
		<view class="info-card" v-if="storeInfo">
			<view class="card-title">
				<text>银行账号信息</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">银行名称</text>
					<text class="value">{{ storeInfo.bankName || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">银行卡账号</text>
					<text class="value">{{ storeInfo.bankAccount || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">开户人姓名</text>
					<text class="value">{{ storeInfo.accountName || '暂无数据' }}</text>
				</view>
			</view>
		</view>

		<!-- 商家实名认证卡片 -->
		<view class="info-card" v-if="storeInfo">
			<view class="card-title">
				<text>商家实名认证</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">营业执照图片</text>
					<image :src="storeInfo.businessLicensePhoto || defaultImage" mode="aspectFill" class="cert-image"></image>
				</view>
				<view class="info-item">
					<text class="label">营业执照名称</text>
					<text class="value">{{ storeInfo.businessLicense || '暂无数据' }}</text>
				</view>
				<view class="info-item">
					<text class="label">法人姓名</text>
					<text class="value">{{ storeInfo.legalPerson || '暂无数据' }}</text>
				</view>
				<!-- <view class="info-item">
					<text class="label">法人身份证</text>
					<text class="value">{{ storeInfo.legalPersonIdCard || '暂无数据' }}</text>
				</view>
				<view class="info-item id-photos">
					<text class="label">身份证照片</text>
					<view class="photo-group">
						<image :src="storeInfo.idCardFrontUrl || defaultImage" mode="aspectFill" class="id-image"></image>
						<image :src="storeInfo.idCardBackUrl || defaultImage" mode="aspectFill" class="id-image"></image>
					</view>
				</view> -->
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-button">
			<button class="submit-btn" @click="applyChange" hover-class="btn-hover">
				申请变更
			</button>
		</view>
		
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">
			<uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
		</view>
	</view>
</template>

<script>
import { getStoreInfos } from '@/api/login.js'; // 请确保路径正确
import {
		getstoreOrderHome
	} from '@/api/login.js'

export default {
	data() {
		return {
			storeId: '', // 商家ID
			storeInfo: null, // 商家信息
			isLoading: false, // 加载状态
			loadingText: {
				contentdown: '上拉显示更多',
				contentrefresh: '加载中...',
				contentnomore: '没有更多数据了'
			},
			defaultImage: '/static/images/line.jpeg', // 默认图片
			// 添加其他需要的数据字段
			storeNum: 0,
			serviceNum: 0,
			packetNum: 0,
			storeName: '',
			username: '',
			phoneNum: '',
			allAmount: 0,
			monthAmount: 0,
			lastMonthAmount: 0
		};
	},
	onLoad() {
		// 首先调用TogetstoreOrderHome获取storeId和其他数据
		this.TogetstoreOrderHome();
	},
	methods: {
		// 获取首页数据，包括storeId
		async TogetstoreOrderHome() {
			this.isLoading = true;
			try {
				const { code, data } = await getstoreOrderHome('STORE');
				if (code === 200) {
					this.storeNum = data.djd;
					this.serviceNum = data.dsm;
					this.packetNum = data.dpd;
					this.storeName = data.storeName;
					this.username = data.userName;
					this.phoneNum = data.phone;
					this.storeId = data.storeId;
					this.allAmount = data.allAmount;
					this.monthAmount = data.monthAmount;
					this.lastMonthAmount = data.lastMonthAmount;
					
					// 获取到storeId后，调用获取商家详情接口
					if (this.storeId) {
						this.getStoreInfo();
					} else {
						uni.showToast({
							title: '未获取到商家ID',
							icon: 'none'
						});
						this.isLoading = false;
					}
				} else {
					uni.showToast({
						title: '获取商家基础信息失败',
						icon: 'none'
					});
					this.isLoading = false;
				}
			} catch (error) {
				console.error('获取商家基础信息出错:', error);
				uni.showToast({
					title: '网络异常，请重试',
					icon: 'none'
				});
				this.isLoading = false;
			}
		},
		
		// 获取商家详细信息
		async getStoreInfo() {
			if (!this.storeId) {
				uni.showToast({
					title: '未找到商家ID',
					icon: 'none'
				});
				this.isLoading = false;
				return;
			}
			
			try {
				const res = await getStoreInfos(this.storeId);
				console.log(res)
				if (res && res.code === 200) {
					this.storeInfo = res.data;
					console.log('商家信息:', this.storeInfo);
				} else {
					uni.showToast({
						title: res.msg || '获取商家信息失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取商家信息出错:', error);
				uni.showToast({
					title: '网络异常，请重试',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		back() {
			uni.navigateBack();
		},
		applyChange() {
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.detail-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 140rpx;
}

.info-card {
	margin: 20rpx 30rpx;
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
			align-items: center;
			padding: 24rpx 0;
			
			&:not(:last-child) {
				border-bottom: 2rpx solid #f5f5f5;
			}

			.label {
				width: 180rpx;
				font-size: 28rpx;
				color: #666;
			}

			.value {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}

			.status-tag {
				display: inline-block;
				padding: 4rpx 16rpx;
				border-radius: 6rpx;
				font-size: 24rpx;
				
				&.success {
					background: #e7f8f3;
					color: #00b578;
				}
				
				&.primary {
					background: #e8f3ff;
					color: #3b7cff;
				}
			}

			.cert-image {
				width: 140rpx;
				height: 90rpx;
				border-radius: 8rpx;
			}

			&.id-photos {
				align-items: flex-start;

				.photo-group {
					flex: 1;
					display: flex;
					gap: 20rpx;

					.id-image {
						width: 140rpx;
						height: 90rpx;
						border-radius: 8rpx;
					}
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
}

.btn-hover {
	transform: scale(0.98);
	opacity: 0.9;
}

.loading {
	padding: 30rpx;
	text-align: center;
}
</style>

