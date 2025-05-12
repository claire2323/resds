<template>
	<view class="manage-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" title="人员管理"
			@clickLeft="uniback" />

		<!-- 筛选区域 -->
		<view class="filter-section">
			<view class="filter-box">
				<uni-data-select v-model="typeValue" :localdata="typeRange" @change="handleTypeChange"
					placeholder="人员类型" class="filter-select" />
				<uni-data-select v-model="statusValue" :localdata="statusRange" @change="handleStatusChange"
					placeholder="人员状态" class="filter-select" />
			</view>
		</view>

		<!-- 人员列表 -->
		<view class="staff-list">
			<view class="staff-card" v-for="(item, i) in list" :key="i">
				<view class="staff-main">
					<view class="staff-avatar">
						<text class="avatar-text">{{item.name ? item.name.substr(0,1) : ''}}</text>
					</view>
					<view class="staff-content">
						<view class="staff-row">
							<view class="staff-info">
								<text class="name">{{item.name}}</text>
								<text class="role" :class="item.roleKey === 'dz' ? 'role-admin' : 'role-staff'">
									{{item.roleKey === 'dz' ? '店长' : '店员'}}
								</text>
								<text class="status" :class="item.status === 0 ? 'status-normal' : 'status-disabled'">
									{{item.status === 0 ? '正常' : '禁用'}}
								</text>
							</view>
							<button class="edit-btn" @click="edit(item)">
								<text class="iconfont icon-edit"></text>
								编辑
							</button>
						</view>
						<view class="phone-row">
							<text class="iconfont icon-phone"></text>
							<text class="phone">{{item.phoneNumber}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加按钮 -->
		<button class="add-btn" hover-class="btn-hover" @click="add">
			<text class="iconfont icon-add"></text>
			新增人员
		</button>
	</view>
</template>

<script>
	import {
		getPersonList
	} from '@/api/cash/index.js'
	import {
		getstoreOrderHome
	} from '@/api/login.js'

	export default {
		data() {
			return {
				typeValue: '',
				statusValue: '',
				typeRange: [{
						value: 'dz',
						text: "店长"
					},
					{
						value: 'dy',
						text: "店员"
					},
				],
				statusRange: [{
						value: 0,
						text: "正常"
					},
					{
						value: 1,
						text: "禁用"
					},
				],
				// 原始列表数据
				originalList: [],
				// 筛选后的列表
				list: [],
				storeId: ''
			};
		},
		onLoad() {
			this.TogetstoreOrderHome()
		},
		methods: {
			async TogetstoreOrderHome() {
				try {
					const {
						code,
						data
					} = await getstoreOrderHome('STORE');
					if (code === 200) {
						this.storeId = data.storeId; // 使用 Vuex mutation
						// console.log(this.storeId);
						// 在获取到 storeId 后立即调用 fetchData
						await this.fetchData();
					}
				} catch (error) {
					console.error('获取店铺信息失败:', error);
					uni.showToast({
						title: '获取店铺信息失败',
						icon: 'none'
					});
				}
			},
			// 获取数据
			async fetchData() {
				const data = await getPersonList(this.storeId);
				// console.log(data)
				this.originalList = data.data.rows || [];
				this.list = [...this.originalList];
			},
			// 处理人员类型筛选
			handleTypeChange(value) {
				this.typeValue = value;
				this.filterList();
			},
			// 处理人员状态筛选
			handleStatusChange(value) {
				this.statusValue = value;
				this.filterList();
			},
			// 筛选列表
			filterList() {
				// 从原始数据开始筛选
				let filteredList = [...this.originalList];

				// 按人员类型筛选
				if (this.typeValue !== '') {
					filteredList = filteredList.filter(item => item.roleKey === this.typeValue);
				}

				// 按人员状态筛选
				if (this.statusValue !== '') {
					filteredList = filteredList.filter(item => item.status === this.statusValue);
				}

				// 更新显示的列表
				this.list = filteredList;
			},
			edit(item) {
				uni.navigateTo({
					url: `/pages/people/addpeople?item=${encodeURIComponent(JSON.stringify(item))}`,
				});
			},
			add() {
				uni.navigateTo({
					url: `/pages/people/addpeople?storeId=${this.storeId}`,
				});
			},
			uniback() {
				uni.navigateTo({
					url:'/pages/index'
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.manage-container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 120rpx;
	}

	.filter-section {
		background: #fff;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.filter-box {
			display: flex;
			gap: 20rpx;

			.filter-select {
				flex: 1;

				:deep(.uni-data-select) {
					border-radius: 8rpx;

					.uni-select--input {
						height: 70rpx;
						line-height: 70rpx;
						font-size: 28rpx;
						padding: 0 20rpx;
					}
				}
			}
		}
	}

	// 标记是数据结构 

	.staff-list {
		padding: 20rpx 30rpx;

		.staff-card {
			background: #fff;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		}

		.staff-main {
			display: flex;
			gap: 24rpx;
		}

		.staff-avatar {
			width: 88rpx;
			height: 88rpx;
			flex-shrink: 0;
			background: linear-gradient(120deg, #3b7cff, #6c47ff);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.avatar-text {
				color: #fff;
				font-size: 30rpx;
				font-weight: bold;
			}
		}

		.staff-content {
			flex: 1;
			min-width: 0;
		}

		.staff-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12rpx;
		}

		.staff-info {
			display: flex;
			align-items: center;
			gap: 12rpx;
			flex: 1;
			min-width: 0;

			.name {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.role,
			.status {
				font-size: 22rpx;
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
				flex-shrink: 0;
			}

			.role-admin {
				background: #e6f3ff;
				color: #3b7cff;
			}

			.role-staff {
				background: #c6ffd9;
				color: #666;
			}

			.status-normal {
				background: #e7f8f3;
				color: #00b578;
			}

			.status-disabled {
				background: #ffece8;
				color: #ff4d4f;
			}
		}

		.phone-row {
			display: flex;
			align-items: center;
			gap: 8rpx;
			color: #999;
			font-size: 26rpx;

			.iconfont {
				font-size: 24rpx;
			}
		}
	}

	.edit-btn {
		flex-shrink: 0;
		height: 56rpx;
		padding: 0 24rpx;
		background: rgba(59, 124, 255, 0.1);
		border: none;
		color: #3b7cff;
		font-size: 26rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		gap: 6rpx;

		&::after {
			border: none;
		}

		.iconfont {
			font-size: 24rpx;
		}

		&:active {
			opacity: 0.8;
		}
	}

	.add-btn {
		position: fixed;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 90rpx;
		background: linear-gradient(120deg, #3b7cff, #6c47ff);
		color: #fff;
		font-size: 32rpx;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		box-shadow: 0 4rpx 20rpx rgba(59, 124, 255, 0.3);

		&::after {
			border: none;
		}

		.iconfont {
			font-size: 36rpx;
		}
	}

	.btn-hover {
		transform: translateX(-50%) scale(0.98);
		opacity: 0.9;
	}
</style>