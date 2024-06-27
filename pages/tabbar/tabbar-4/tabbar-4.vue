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
            if (this.isCameraOpen) {
                // 关闭视频，发送6
                this.sendVideoData(6);
                this.isCameraOpen = false;
                this.buttonText1 = 'openCamera';
                this.cameraUrl = '';
            } else {
                // 打开视频，发送7
                this.sendVideoData(7);
                this.isCameraOpen = true;
                this.buttonText1 = 'closeCamera';
                // 设置远程摄像头的流媒体地址
                this.cameraUrl = 'http://192.168.145.40:8080/?action=stream';
            }
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
        <view><button @click="toggleCamera">{{ buttonText1 }}</button>
        <img v-if="isCameraOpen" :src="cameraUrl" autoplay controls default-src></img>
        </view>
		<button @click="toggleMusic">{{ buttonText2 }}</button>
        <view v-if="isMusicOpen" class="music-list">
            <button v-for="item in musicList" :key="item" @click="sendMusicData(item)">Item {{ item }}</button>
        </view>
    </view>
</template>

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
img {
    width: 100%;
    height: 100%;
    margin-top: 20px;
}
.music-list {
    margin-top: 20px;
}
.music-list button {
    display: block;
    margin: 10px auto;
    width: 100px;
}
</style>
