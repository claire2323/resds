<template>
	<view class="register-container">
		<!-- 顶部背景 -->
		<view class="top-bg"></view>

		<!-- 注册表单区域 -->
		<view class="register-box">
			<!-- Logo -->
			<view class="logo-box">
				<image class="logo" :src="image" mode="aspectFit"></image>
				<text class="title">欢迎注册</text>
			</view>

			<!-- 表单输入区 -->
			<view class="input-group">
				<view class="input-box">
					<text class="iconfont icon-user"></text>
					<input v-model="registerForm.username" type="text" placeholder="请输入账号" maxlength="30" />
				</view>

				<view class="input-box">
					<text class="iconfont icon-password"></text>
					<input v-model="registerForm.password" type="password" placeholder="请输入密码" maxlength="20" />
				</view>

				<view class="input-box">
					<text class="iconfont icon-password"></text>
					<input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" maxlength="20" />
				</view>

				<view class="input-box verify-box" v-if="captchaEnabled">
					<text class="iconfont icon-code"></text>
					<input v-model="registerForm.code" type="text" placeholder="请输入验证码" maxlength="4" />
					<image :src="codeUrl" @click="getCode" class="verify-img"></image>
				</view>
			</view>

			<!-- 注册按钮 -->
			<button @click="handleRegister" class="register-btn">注 册</button>

			<!-- 底部链接 -->
			<view class="bottom-links">
				<view class="login-link" @click="handleUserLogin">
					<text>已有账号？立即登录</text>
				</view>
				<!-- <view class="agreement-links">
					<text class="text-grey">注册即代表同意</text>
					<text class="link">《用户协议》</text>
					<text class="link">《隐私政策》</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<style lang="scss">
	.register-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		position: relative;
	}

	.top-bg {
		height: 400rpx;
		background: linear-gradient(45deg, #3b7cff, #6c47ff);
		border-bottom-left-radius: 40% 15%;
		border-bottom-right-radius: 40% 15%;
	}

	.register-box {
		position: absolute;
		top: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		padding: 40rpx;
	}

	.logo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60rpx;

		.logo {
			width: 120rpx;
			height: 120rpx;
			margin-bottom: 20rpx;
		}

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.input-box {
		display: flex;
		align-items: center;
		height: 90rpx;
		background-color: #f8f8f8;
		border-radius: 45rpx;
		margin-bottom: 30rpx;
		padding: 0 30rpx;

		.iconfont {
			font-size: 40rpx;
			color: #999;
			margin-right: 20rpx;
		}

		input {
			flex: 1;
			font-size: 28rpx;
		}
	}

	.verify-box {
		.verify-img {
			width: 200rpx;
			height: 60rpx;
			border-radius: 6rpx;
		}
	}

	.register-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(45deg, #3b7cff, #6c47ff);
		border-radius: 45rpx;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 40rpx;

		&:active {
			opacity: 0.8;
		}
	}

	.bottom-links {
		text-align: center;

		.login-link {
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;
		}

		.agreement-links {
			font-size: 24rpx;
			color: #999;

			.link {
				color: #3b7cff;
				margin: 0 10rpx;
			}
		}
	}
</style>

<script>
	import {
		getCodeImg,
		register
	} from '@/api/login'

	export default {
		data() {
			return {
				image: '/static/images/loading.png',
				registerForm: {
					username: "",
					password: "",
					confirmPassword: "",
					code: "",
					uuid: ''
				},
				codeUrl: "",
				captchaEnabled: true,
				globalConfig: getApp().globalData.config
			}
		},
		created() {
			this.getCode()
		},
		methods: {
			handleUserLogin() {
				uni.navigateTo({
					url: '/pages/login'
				})
			},
			async getCode() {
				const res = await getCodeImg()
				this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
				if (this.captchaEnabled) {
					this.codeUrl = 'data:image/gif;base64,' + res.img
					this.registerForm.uuid = res.uuid
				}
			},
			async handleRegister() {
				if (this.registerForm.username === "") {
					this.$modal.msgError("请输入您的账号")
					return
				}
				if (this.registerForm.password === "") {
					this.$modal.msgError("请输入您的密码")
					return
				}
				if (this.registerForm.confirmPassword === "") {
					this.$modal.msgError("请再次输入您的密码")
					return
				}
				if (this.registerForm.password !== this.registerForm.confirmPassword) {
					this.$modal.msgError("两次输入的密码不一致")
					return
				}
				if (this.registerForm.code === "" && this.captchaEnabled) {
					this.$modal.msgError("请输入验证码")
					return
				}

				this.$modal.loading("注册中，请耐心等待...")

				try {
					await register(this.registerForm)
					this.$modal.closeLoading()
					uni.showModal({
						title: "系统提示",
						content: "恭喜你，您的账号 " + this.registerForm.username + " 注册成功！",
						success: (res) => {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/login'
								})
							}
						}
					})
				} catch (error) {
					if (this.captchaEnabled) {
						await this.getCode()
					}
				}
			}
		}
	}
</script>