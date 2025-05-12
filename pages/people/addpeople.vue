<template>
	<view class="add-people-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar dark :fixed="true" 
			shadow 
			background-color="#3b7cff" 
			status-bar 
			left-icon="left"
			left-text="返回"
			:title="objData.name ? '编辑人员' : '新增人员'" 
			@clickLeft="uniback" />

		<!-- 表单内容 -->
		<view class="form-content">
			<view class="form-card">
				<!-- 基本信息 -->
				<view class="form-section">
					<view class="section-title">基本信息</view>
					<view class="form-item">
						<text class="label">员工姓名</text>
						<input 
							class="input"
							type="text"
							v-model="formData.name"
							placeholder="请输入员工姓名"
							placeholder-class="placeholder"
						/>
					</view>
					<view class="form-item">
						<text class="label">联系电话</text>
						<input 
							class="input"
							type="number"
							v-model="formData.phoneNumber"
							placeholder="请输入电话号码"
							placeholder-class="placeholder"
							maxlength="11"
						/>
					</view>
				</view>

				<!-- 角色设置 -->
				<view class="form-section">
					<view class="section-title">角色设置</view>
					<view class="form-item">
						<text class="label">人员类型</text>
						<view class="radio-group">
							<view class="radio-item" 
								  v-for="(item, index) in typeOptions" 
								  :key="index"
								  @click="selectType(item.value)"
								  :class="{'radio-active': formData.type === item.value}">
								<text class="radio-text">{{item.label}}</text>
							</view>
						</view>
					</view>
					<view class="form-item">
						<text class="label">人员状态</text>
						<view class="radio-group">
							<view class="radio-item"
								  v-for="(item, index) in stateOptions" 
								  :key="index"
								  @click="selectState(item.value)"
								  :class="{'radio-active': formData.state === item.value}">
								<text class="radio-text">{{item.label}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-button">
			<button class="submit-btn" @click="submit" hover-class="btn-hover">
				确认提交
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.add-people-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 140rpx;
}

.form-content {
	padding: 30rpx;
}

.form-card {
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
	overflow: hidden;
}

.form-section {
	padding: 30rpx;
	
	& + .form-section {
		border-top: 2rpx solid #f5f5f5;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 30rpx;
	}
}

.form-item {
	margin-bottom: 30rpx;
	
	&:last-child {
		margin-bottom: 0;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 16rpx;
	}

	.input {
		height: 88rpx;
		background: #f8f9fc;
		border-radius: 12rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #333;
	}

	.placeholder {
		color: #999;
	}
}

.radio-group {
	display: flex;
	gap: 20rpx;
}

.radio-item {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fc;
	border-radius: 12rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s;

	&.radio-active {
		background: rgba(59,124,255,0.1);
		border-color: #3b7cff;
		
		.radio-text {
			color: #3b7cff;
		}
	}

	.radio-text {
		font-size: 28rpx;
		color: #666;
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
</style>

<script>
export default {
	data() {
		return {
			objData: {},
			formData: {
				name: '',
				phoneNumber: '',
				type: '0',
				state: '0'
			},
			typeOptions: [
				{ label: '管理员', value: '0' },
				{ label: '服务人员', value: '1' }
			],
			stateOptions: [
				{ label: '启用', value: '0' },
				{ label: '禁用', value: '1' }
			]
		}
	},
	onLoad(e) {
		if (e.item) {
			const item = JSON.parse(decodeURIComponent(e.item))
			console.log('编辑数据:', item)
			this.objData = item
			this.initFormData()
		}
	},
	methods: {
		initFormData() {
			this.formData.name = this.objData.name
			this.formData.phoneNumber = this.objData.phoneNumber 
			this.formData.type = this.objData.job === '管理员' ? '0' : '1'
			this.formData.state = this.objData.state === '正常' ? '0' : '1'
		},
		selectType(value) {
			this.formData.type = value
		},
		selectState(value) {
			this.formData.state = value
		},
		async submit() {
			if (!this.formData.name) {
				uni.showToast({
					title: '请输入员工姓名',
					icon: 'none'
				})
				return
			}
			if (!this.formData.phoneNumber) {
				uni.showToast({
					title: '请输入联系电话',
					icon: 'none'
				})
				return
			}
			
			console.log('提交数据:', this.formData)
			await uni.showToast({
				title: '提交成功',
				icon: 'success',
				duration: 1500
			})
			
			setTimeout(() => {
				this.uniback()
			}, 1500)
		},
		uniback() {
			uni.navigateTo({
				url: '/pages/people/manage'
			})
		}
	}
}
</script>
