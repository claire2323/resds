<template>
	<view>
		<uni-nav-bar dark :fixed="true" 
		shadow background-color="rgb(224, 86, 253)" status-bar 
		left-icon="left" left-text="返回"
		:title="name" @clickLeft="back" />
	</view>
</template>

<script>
export default {
	name: "my-navbar",
	props:{
		name:{
			type:String,
		}
	},
	data() {
		return {

		};
	},
	onLoad(){
	},
	methods: {
		back() {
			this.$emit('uniback',true)
		}
	}
}
</script>

<style lang="scss"></style>