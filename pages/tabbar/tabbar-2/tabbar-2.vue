<script>
import { ResViewModel } from './model/ResViewModel';

export default {
    data() {
        let resModel = new ResViewModel();
        let resSource1 = resModel.loadResDataSource1();
        
        return {
            resData: resSource1, // 此处resData用来在组件中存储资源数据
            currentItem: null, // 当前展示的数据项
            historyRecords: [] // 历史记录
        }
    },
    onShow() {
        // 检查是否通过按钮点击进入
        const isFromButton = uni.getStorageSync('isFromButton');
        if (isFromButton) {
            const generatedId = uni.getStorageSync('generatedId');
            console.log('tabbar2:Retrieved ID:', generatedId);
            
            if (generatedId) {
                this.loadData(generatedId);
            }

            // 清除标志位
            uni.removeStorageSync('isFromButton');
        } else {
            // 如果不是通过按钮点击进入，确保currentItem为空
            this.currentItem = null;
        }

        // 从 localStorage 中获取历史记录
        const history = uni.getStorageSync('historyRecords') || [];
        this.historyRecords = history;
        console.log('tabbar2:historyRecords:', history);
    },
    methods: {
        loadData(id) {
            this.currentItem = this.resData.find(item => item.id === parseInt(id));
            if (this.currentItem) {
                this.addHistoryRecord(this.currentItem);
            }
        },
	   addHistoryRecord(item) {
			const currentTime = new Date();
			const formattedTime = `${currentTime.getFullYear()}.${currentTime.getMonth() + 1}.${currentTime.getDate()}  ${currentTime.getHours()}:${currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}`;
			console.log(currentTime)
			console.log(formattedTime)
			this.historyRecords.unshift({ id: item.id, type: item.type, res: item.res, time: formattedTime });

			// 保存历史记录到 localStorage
			uni.setStorageSync('historyRecords', this.historyRecords);
		}
    },
}
</script>

<template>
    <view class="content">
        <div class="content2" v-if="currentItem">
			<p>检测结果如下</p>
            <p>{{ currentItem.type }}</p>
            <p>{{ currentItem.res }}</p>
        </div>
        
        <div class="history">
            <div class='title'><h3>历史记录</h3></div>
            <div v-if="historyRecords.length === 0">暂无记录</div>
            <ul>
                <li class='list1' v-for="record in historyRecords" :key="record.time">
                    <span>时间: {{ record.time }}</span>
                    <span>类型: {{ record.type }}</span>
                    <span>结果: {{ record.res }}</span>
                </li>
            </ul>
        </div>
    </view>
</template>

<style>
    .content {
        text-align: center;
    }
    .content2 {
        color: #1014f3;
		margin-top: 25px;
    }
    .history {
        margin-top: 20px;
    }
	.title{
		margin-bottom: 20px;
	}
    ul {
        list-style-type: none; /* 移除列表样式 */
        padding: 0; /* 移除默认内边距 */
    }
    .list1 {
        border: solid #aaaaaa; /* 添加边框 */
		border-width: 2px 0 2px 0;
        padding: 6px; /* 内边距 */
        display: flex; /* 使用 flexbox 布局 */
        flex-direction: column; /* 垂直排列 */
    }
    .list1 span {
        margin: 5px 0; /* 每个 span 的上下外边距 */
    }
    .history p {
        color: #333;
    }
</style>