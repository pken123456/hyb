<script>
export default {
  data() {
    return {
      title: 'Hello',
      userInput: '',
      messages: [],
      accessToken: '24.85adc768db8083a9a7b9f00c7caa4685.2592000.1721902062.282335-87043351', // 已知的 access token
      scrollTop: 0 // 用于控制 scroll-view 的滚动位置
    };
  },
  methods: {
    updateScrollTop() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chat-container').boundingClientRect((rect) => {
          this.scrollTop = rect.height;
        }).exec();
      });
    },
    async sendMessage() {
      if (this.userInput.trim() === '') return;
      this.messages.push({ text: this.userInput, user: true });
      this.updateScrollTop();
      const userMessage = this.userInput;
      this.userInput = '';

      try {
        const response = await uni.request({
          url: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=${this.accessToken}`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            messages: [
              {
                role: 'user',
                content: userMessage
              }
            ]
          }
        });
		
        const botResponse = response.data.result;
        this.messages.push({ text: botResponse, user: false });
        this.updateScrollTop();
      } catch (error) {
        console.error('Error during API call:', error);
        this.messages.push({ text: 'Error: Unable to communicate with the bot', user: false });
        this.updateScrollTop();
      }
    }
  }
};
</script>

<template>
  <view class="content">
    <scroll-view class="chat-container" scroll-y :scroll-top="scrollTop">
      <view v-for="(message, index) in messages" :key="index" class="message" :class="{'user-message': message.user }">
        {{ message.text }}
      </view>
    </scroll-view>
    <textarea class="input-box" confirm-type="send"
	 v-model="userInput" @blur="sendMessage" placeholder="Type your message..." />
    <button class="send-button" @tap="sendMessage">发送</button>
  </view>
</template>

<style>
  .content {
    height: 100%;
  }
  .chat-container {
    border: 1px solid #ccc;
    padding: 10px;
    height: 80%;
    overflow-y: scroll;
  }
  .message {
	text-align: left;
    padding: 20px;
	margin-left: 20px;
    margin-right: 25%;
  }
  .user-message {
    text-align: right;
	margin-right: 20px;
	margin-left: 25%;
  }
  .input-box {
	width: 100%;
	height: 7%;
    padding: 10px 20px 10px 20px;
/*    margin: 0 20px 0 20px; */
  }
  .send-button {
	height: 7%;
	background-color:mediumspringgreen;
    padding: 10px;
  }
</style>

