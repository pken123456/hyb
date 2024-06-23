<template>
	<view class="content">
		<button @click="openCamera">openCamera</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			openCamera(){
				
			}
			
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
		margin-top: 200upx;
	}
	button {
	    height: 50px;
	    width: 200px;
	}
</style>
