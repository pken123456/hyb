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
    },
};
</script>

<template>
    <view class="content">
        <view v-if="isLoading" class="loading-container">
            <view class="loader"></view>
        </view>
        <view v-else @click="goToPage2" class="circle-button">开始推测</view>
    </view>
</template>

<style>
.content {
    text-align: center;
}

.circle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
    color: white;
    background-color: #056cff;
    width: 200px; /* 为圆形按钮设置固定宽度 */
    height: 200px; /* 为圆形按钮设置固定高度 */
    border-radius: 100px; /* 为了实现圆形形状，设置为宽度/高度的一半 */
    text-align: center;
    margin: 200px auto; /* 将按钮居中 */
    box-shadow: 0 5px 50px #056cff; /* 阴影效果 */
    opacity: 0.95;
    transition: transform 0.3s; /* 动画效果 */
}

.circle-button:hover {
    transform: scale(1.05); /* 鼠标悬停效果 */
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
	margin-top: 50%;
}

.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>