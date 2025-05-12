<template>
    <view class="loading-container">
        <image class="img" :src="image"></image>
        <text class="text-content">第三方服务-员工端</text>
        <view class="loading">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            image: '/static/images/loading.png'
        };
    },
	mounted(){
			console.log('dfsddfs')
	        setTimeout(() => {
	            // uni.navigateTo({
	            //     url: '/pages/login/employee-login'
	            // });
	        }, 3000);
	    },
    methods: {}
};
</script>

<style scoped>
.loading-container {
    background-color: #fff;
    display: flex;
 
    align-items: center;
    flex-direction: column;
    height: 100vh; 
}

.img {
    height: 75rpx;
    width: 75rpx;
	margin-top:140rpx;
}

.text-content {
    margin-top: 10px;
    margin-bottom: 10px;
	font-size: 36rpx;
	font-weight: bold;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dot {
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 50%;
    margin: 0 3px;
    animation: bounce 1.4s infinite ease-in-out both;
}

.dot-1 {
    animation-delay: -0.32s;
}

.dot-2 {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}
</style>