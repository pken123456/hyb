<script>
export default {
    data() {
        return {
            title: 'Hello',
            cameraUrl: '',
            buttonText1: 'openCamera',
            buttonText2: 'musicon',
            isCameraOpen: false,
            isMusicOpen: false,
            musicList: [1, 2, 3, 4, 5, 6, 7],
        }
    },
    methods: {
		toggleCamera() {
			// 在调用sendVideoData之前不立即改变状态
			const videoAction = this.isCameraOpen ? 6 : 7; // 如果摄像头已打开则发送6以关闭，否则发送7以打开
			this.sendVideoData(videoAction).then(receivedId => {
				// 成功接收到响应后，根据操作更改状态和UI
				if (videoAction === 6) {
					// 如果是关闭操作，更新状态为关闭
					this.isCameraOpen = false;
					this.buttonText1 = 'openCamera';
					this.cameraUrl = '';
				} else if (videoAction === 7) {
					// 如果是打开操作，更新状态为打开
					this.isCameraOpen = true;
					this.buttonText1 = 'closeCamera';
					this.cameraUrl = 'http://192.168.145.40:8080/?action=stream';
				}
				console.log(`操作成功，receivedId: ${receivedId}`);
			}).catch(error => {
				// 处理发送数据失败的情况
				console.error(`操作失败: ${error}`);
			});
		},
        sendVideoData(data) {
            return new Promise((resolve, reject) => {
                // 假设香橙派开发板的IP地址为 192.168.145.40，具体根据实际情况调整
                const deviceIP = 'http://192.168.145.40:5001';
                uni.request({
                    url: `${deviceIP}/video`, // 根据香橙派接收数据的接口路径
                    method: 'POST',
                    data: { data: data },
                    success: (res) => {
                        if (res.statusCode === 200 && res.data && typeof res.data.receivedId === 'number') {
                            console.log('数据发送成功', res);
                            resolve(res.data.receivedId);
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
		toggleMusic() {
		    if (this.isMusicOpen) {
		        // 关闭音乐
		        this.isMusicOpen = false;
		        this.buttonText2 = 'musicon';
		    } else {
		        // 打开音乐
		        this.isMusicOpen = true;
		        this.buttonText2 = 'musicoff';
		    }
		},
        sendMusicData(data) {
            return new Promise((resolve, reject) => {
                // 假设香橙派开发板的IP地址为 192.168.145.40，具体根据实际情况调整
                const deviceIP = 'http://192.168.145.40:5001';
                uni.request({
                    url: `${deviceIP}/music`, // 根据香橙派接收数据的接口路径
                    method: 'POST',
                    data: { data: data},
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
}
</script>

<template>
    <view class="content">
        <view class="cameratype">
			<button type="primary" @click="toggleCamera">{{ buttonText1 }}</button>
			<button type="primary" @click="toggleMusic">{{ buttonText2 }}</button>
		</view>
		<view>
			<view v-if="isMusicOpen" class="music-list">
				<button type="default" v-for="item in musicList" :key="item" @click="sendMusicData(item)">Item {{ item }}</button>
			</view>
			<view>
				<img id="video-stream" class="video-player" 
				v-if="isCameraOpen" :src="cameraUrl" autoplay controls></img>
			</view>
		</view>
    </view>
</template>

<style>
.content {
	display: block;
	align-items: center;
	justify-content: center;
	text-align: center;
}
.cameratype{
	display: flex;
	align-items: center;
	justify-content: space-around;
	text-align: center;
	margin-top: 10px;
}
.cameratype button {
    height: 50px;
    width: 180px;
	background-color: #056cff;
	color: white;
}
.video-player {
    width: 100%;
    height: 100%;
    margin-top: 20%;
}
.music-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    flex-direction: column;
}
.music-list button {
    width: 200px;
	margin: 10px;
	background-color: #056cff;
	color: white;
}
</style>
