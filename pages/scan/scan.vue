<template>
	<view class="scan-container">
		<uni-nav-bar dark :fixed="true" shadow background-color="#3b7cff" status-bar left-icon="left" title="扫一扫"
			@clickLeft="goBack" />
		<view class="reader-container">
			<div id="reader"></div>
		</view>
	</view>
</template>

<script>
	import {
		Html5Qrcode
	} from "html5-qrcode"
	import {
		elderSign,
		elderSignTypeDict
	} from '@/api/elder'
	export default {
		data() {
			return {
				html5QrCode: null,
				isScanning: false,
				signType: 0 // 默认为食堂签到
			}
		},
		methods: {
			async goBack() {
				try {
					if (this.isScanning && this.html5QrCode) {
						await this.html5QrCode.stop()
						this.isScanning = false
					}
				} catch (error) {
					console.warn('停止扫码出错:', error)
				}
				uni.navigateBack()
			},
			async onScanSuccess(decodedText, decodedResult) {
				try {
					if (this.isScanning && this.html5QrCode) {
						await this.html5QrCode.stop()
						this.isScanning = false
					}

					// 调用签到接口
					const res = await elderSign({
						code: decodeText
					})

					if (res.code === 200) {
						uni.showToast({
							title: '签到成功',
							icon: 'success',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.msg || '签到失败',
							icon: 'none',
							duration: 2000
						})
					}

					// console.log('扫码结果:', decodedText)

					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					uni.showToast({
						title: '签到失败',
						icon: 'none',
						duration: 2000
					})
				}
			},
			onScanError(error) {
				console.warn('扫码错误:', error)
				uni.showToast({
					title: '扫码失败，请重试',
					icon: 'none',
					duration: 2000
				})
			},
			async initScanner() {
				try {
					if (!this.html5QrCode) {
						this.html5QrCode = new Html5Qrcode("reader")
					}

					if (!this.isScanning) {
						const config = {
							fps: 10,
							qrbox: 250,
							aspectRatio: 1.0
						}

						await this.html5QrCode.start({
								facingMode: "environment"
							},
							config,
							this.onScanSuccess,
							this.onScanError
						)
						this.isScanning = true
					}
				} catch (error) {
					console.error('初始化扫码器出错:', error)
					uni.showToast({
						title: '无法启动相机',
						icon: 'none'
					})
				}
			}
		},
		async mounted() {
			await this.$nextTick()
			setTimeout(() => {
				this.initScanner()
			}, 500)
		},
		async beforeDestroy() {
			try {
				if (this.isScanning && this.html5QrCode) {
					await this.html5QrCode.stop()
					this.isScanning = false
				}
			} catch (error) {
				console.warn('销毁扫码器出错:', error)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.scan - container {
		height: 100 vh;
		background: #000;

		.reader-container {
			padding-top: 88rpx;
			height: calc(100vh - 88rpx);
			display: flex;
			justify-content: center;
			align-items: center;

			#reader {
				width: 100%;
				height: 100%;
				background: #000;

				::v-deep video {
					object-fit: cover;
				}
			}
		}
	}
</style>