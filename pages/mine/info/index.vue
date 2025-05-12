<template>
  <view class="container">
    <uni-list>
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'person-filled'}" title="昵称" :rightText="user.nickName" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'phone-filled'}" title="手机号码" :rightText="user.phonenumber" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'email-filled'}" title="邮箱" :rightText="user.email" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'auth-filled'}" title="岗位" :rightText="postGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'staff-filled'}" title="角色" :rightText="roleGroup" />
      <uni-list-item showExtraIcon="true" :extraIcon="{type: 'calendar-filled'}" title="创建日期" :rightText="user.createTime" />
    </uni-list>
  </view>
</template>

<script>
  import { getUserProfile } from "@/api/system/user"

  export default {
    data() {
      return {
        user: {},
        roleGroup: "",
        postGroup: ""
      }
    },
    onLoad() {
      this.getUser()
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data
          this.roleGroup = response.roleGroup
          this.postGroup = response.postGroup
		  console.log(response)
        })
      }
    }
  }
</script>

<style lang="scss">
  .container {
    padding: 40rpx;
    // background: linear-gradient(to bottom, #e0f7fa, #ffffff);
    min-height: 100vh;
  }

  uni-list {
    background-color: transparent; /* 去除列表背景色 */
  }

  uni-list-item {
    background-color: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 30rpx; /* 增加表单项之间的间距 */
    padding: 30rpx;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5rpx);
      box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
    }

    &:last-child {
      margin-bottom: 0; /* 最后一个表单项不需要间距 */
    }

    .uni-list-item__title {
      font-size: 32rpx;
      color: #00796b;
      font-weight: 500;
    }

    .uni-list-item__right-text {
      font-size: 30rpx;
      color: #004d40;
      font-weight: 400;
    }

    .uni-list-item__icon {
      color: #00796b;
      font-size: 36rpx;
      margin-right: 20rpx;
    }
  }
</style>