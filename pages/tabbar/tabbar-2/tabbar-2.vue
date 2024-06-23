<template>
    <view class="content">
       <div class="content2" v-if="currentItem">
            <p>{{ currentItem.type }}</p>
            <p>{{ currentItem.res }}</p>
        </div>
        
        <div class="history">
            <h3>历史记录</h3>
            <div v-if="historyRecords.length === 0">暂无记录</div>
            <div v-for="record in historyRecords" :key="record.time">
                <p>时间: {{ record.time }}</p>
                <p>类型: {{ record.type }}</p>
                <p>结果: {{ record.res }}</p>
            </div>
        </div>
    </view>
</template>

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
            console.log('Retrieved ID:', generatedId);

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
    },
    methods: {
        loadData(id) {
            this.currentItem = this.resData.find(item => item.id === parseInt(id));
            if (this.currentItem) {
                this.addHistoryRecord(this.currentItem);
            }
        },
        addHistoryRecord(item) {
            const currentTime = new Date().toLocaleString();
            this.historyRecords.unshift({ id: item.id, type: item.type, res: item.res, time: currentTime });

            // 保存历史记录到 localStorage
            uni.setStorageSync('historyRecords', this.historyRecords);
        }
    }
}
</script>

<style>
    .content {
        text-align: center;
        margin-top: 200upx;
    }
    .content2 {
        color: #f35622;
    }
    .history {
        margin-top: 20px;
    }
    .history p {
        color: #333;
    }
</style>