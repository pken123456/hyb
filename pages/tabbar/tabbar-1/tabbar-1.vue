<template>
    <view class="content">
        <view v-if="isLoading" class="wait-container">
            <view v-if="showLoading" class="progress-container">
                <view class="progress-bar" :style="{ width: progress + '%' }"></view>
                <p>录音中</p>
            </view>
            <view v-else class="loader-container">
                <view class="loader"></view>
                <p font-size="10px">请等待检测结果</p>
            </view>
        </view>
        <view v-else>
            <view class="uni-list">
                <view class="uni-list-cell">{{ text }}</view>
                <switch color="#056cff" @change="changemode"/>
            </view>
            <view v-if="isActive" @click="goToPage2" class="circle-button">开始推测</view>
            <view v-else class="contentp">
                <p>持续检测中</p>
                <p>检测到异常状态时会进行弹窗提醒</p>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false, // 控制加载动画显示的标志位
            text: '主动模式',
            isActive: true, // 控制检测模式
            showLoading: true,
            progress: 0,
        };
    },
    methods: {
        goToPage2() {
            this.isLoading = true;
            this.showLoading = true;
            this.progress = 0;
            let interval = setInterval(() => {
                if (this.progress < 100) {
                    this.progress += 1;
                } else {
                    clearInterval(interval);
                    this.showLoading = false; // 当进度条满了之后，切换到loader
                }
            }, 70);
            // 发送数据到设备
            this.Infer(1).then((receivedId) => {
                console.log('tabbar1:Received ID:', receivedId);
                // 存储接收到的ID和标志位
                uni.setStorageSync('generatedId', receivedId);
                uni.setStorageSync('isFromButton', true);

                // 立即跳转到目标页面
                uni.switchTab({
                    url: '/pages/tabbar/tabbar-2/tabbar-2',
                });
				this.isLoading = false;
            }).catch(err => {
                console.error('Failed to send data:', err);
                uni.showToast({
                    title: `Failed to send data: ${err.errMsg}`,
                    icon: 'none'
                });
                this.isLoading = false; // 失败时隐藏加载动画
                clearInterval(interval);
            });
        },

        Infer(data) {
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
        },

        changemode() {
            this.isActive = !this.isActive;
            if (this.isActive === false) {
                this.beginchangemode(1);
                this.text = '被动模式';
            } else {
                this.beginchangemode(2);
                this.text = '主动模式';
            }
        },

        beginchangemode(data) {
            return new Promise((resolve, reject) => {
                const deviceIP = 'http://192.168.145.40:5001';
                uni.request({
                    url: `${deviceIP}/mode`, // 根据香橙派接收数据的接口路径
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

<style>
.content {
    text-align: center;
}
.uni-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.uni-list-cell {
    margin: 10px;
}
.circle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
	font-weight: bold;
    color: white;
    background-color: #3d87ff;
    width: 200px; /* 为圆形按钮设置固定宽度 */
    height: 200px; /* 为圆形按钮设置固定高度 */
    border-radius: 100px; /* 为了实现圆形形状，设置为宽度/高度的一半 */
    text-align: center;
    margin: 40% auto; /* 将按钮居中 */
    box-shadow: 0 0 10px #3d87ff; /* 阴影效果 */
    opacity: 0.95;
    transition: transform 0.3s; /* 动画效果 */
}

.contentp {
    display: block;
    margin: 50% auto; /* 居中 */
}

.wait-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    margin-top: 40%;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-container {
    width: 80%;
    overflow: hidden;
    height: 80px;
    margin: 20px 0;
	padding: 10px;
	display: block;
}

.progress-container p{
	display: flex;
	justify-content: center;
}
.progress-bar {
    height: 50%;
	background-color: #f3f3f3;
	border-radius: 50px;
    background-color: #056cff;
    transition: width 0.3s ease;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
}
.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #056cff; /* Blue */
    border-radius: 50%;
    width: 150px;
    height: 150px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
