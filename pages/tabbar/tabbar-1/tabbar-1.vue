<template>
    <view class="content">
        <view v-if="isLoading">Loading...</view>
        <button v-else @click="goToPage2">Go to Page 2</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false // 控制加载动画显示的标志位
        };
    },
    onShow() {
        // 每次页面显示时重置加载状态
        this.isLoading = false;
    },
    methods: {
        goToPage2() {
            this.isLoading = true;

            // 发送数据到设备
		   this.sendDataToDevice(1).then((receivedId) => {
				console.log('tabbar1:Received ID:', receivedId);
				// 存储接收到的ID和标志位
				uni.setStorageSync('generatedId', receivedId);
				uni.setStorageSync('isFromButton', true);
	
				// 立即跳转到目标页面
				uni.switchTab({
					url: '/pages/tabbar/tabbar-2/tabbar-2',
				});
			}).catch(err => {
				console.error('Failed to send data:', err);
				uni.showToast({
					title: `Failed to send data: ${err.errMsg}`,
					icon: 'none'
				});
				this.isLoading = false; // 失败时隐藏加载动画
			});
		},
		
        sendDataToDevice(data) {
            return new Promise((resolve, reject) => {
                const deviceIP = 'http://192.168.145.40:5001';
                uni.request({
                    url: `${deviceIP}/infer`, // 根据香橙派接收数据的接口路径
                    method: 'POST',
                    data: { data: data },
                    success: (res) => {
                        if (res.statusCode === 200 && res.data && typeof res.data.receivedId === 'number') {
                            console.log('数据发送成功', res);
                            resolve(res.data.receivedId); // 假设服务器返回的消息格式为 { receivedId: number }
                        } else {
                            reject(new Error('Invalid response format'));
                        }
                    },
                    fail: (err) => {
                        console.log('数据发送失败', err);
                        reject(err);
                    }
                });
            });
        }

    }
};
</script>

<style>
.content {
    text-align: center;
    margin-top: 200upx;
}

button {
    height: 50px;
    width: 200px;
}
</style>
