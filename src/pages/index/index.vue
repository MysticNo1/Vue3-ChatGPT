<template>
  <div class="main">
    <div class="content" id="content">
      <div :key="index" v-for="(item, index) in this.messageList">
        <!--用户-->
        <div class="visitor" v-if="item.user=='visitor'">
          <div class="station"></div>
          <div class="text">
            <span>{{ item.content }}</span>
          </div>
          <img src="@/assets/images/visitor.png"/>
        </div>
        <!--机器人-->
        <div class="robot" v-if="item.user=='robot'">
          <img src="@/assets/images/robot.png"/>
          <div class="text">
            <v-md-preview :text="item.content"/>
          </div>
          <div class="station"></div>
        </div>
      </div>
    </div>
    <!--底部-->
    <div class="bottom">
      <van-field v-model="sendData" placeholder="请输入"/>
      <van-button size="large" :disabled="sendFlag" type="primary" v-on:click="sendMessage(sendData, 'visitor')">发送
      </van-button>
    </div>
  </div>
</template>

<script>
import {ref, defineComponent, watch} from 'vue';
import {showToast} from 'vant';
import axios from 'axios';

export default defineComponent({
  name: "HomePage",
  setup: function () {
    const sendData = ref('');
    const oldSendData = ref('');
    const messageList = ref([]);
    const streamFlag = ref(true);
    // 默认发送状态可点击
    const sendFlag = ref(false);
    const loadLoop = function () {
    };
    //监听内容区域自动滚动显示
    watch(messageList.value, () => {
      document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
    });

    function sendMessage(data, user) {
      //判断空
      if (data <= 0) {
        showToast("无内容可发送！");
        return;
      }
      let obj = {};
      obj.user = user;
      obj.content = data;
      this.messageList.push(obj);
      this.sendFlag = true;
      this.oldSendData = data
      this.sendData = '';
      this.postRequest(data);
    }

    function loadFlash() {
      let obj = {};
      obj.user = 'robot';
      obj.content = '';
      this.messageList.push(obj);
      let index = 0;
      this.loadLoop = setInterval(() => {
        switch (index % 2) {
          case 0:
            this.messageList[this.messageList.length - 1].content = "加载中...";
            break;
          case 1:
            this.messageList[this.messageList.length - 1].content = "...";
            break;
        }
        index++;
      }, 500);
    }

    function postRequest(sendMessage) {
      let params = {model: "gpt-3.5-turbo", stream: this.streamFlag};
      params.messages = [{"role": "user", "content": sendMessage}];
      this.loadFlash();
      axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        data: params
      }).then((response) => {
        this.messageList[this.messageList.length - 1].content = '';
        clearInterval(this.loadLoop);
        if (this.streamFlag) {
          let responseFinish;
          let responseByte;
          let index = 0;
          let byteLoop = setInterval(() => {
            responseByte = JSON.parse(response.data.slice(5).split("data:")[index]).choices[0].delta.content;
            this.messageList[this.messageList.length - 1].content += responseByte == null ? "" : responseByte;
            //结束
            responseFinish = JSON.parse(response.data.slice(5).split("data:")[index]).choices[0].finish_reason;
            if (responseFinish === "stop") {
              clearInterval(byteLoop);
              this.sendFlag = false
            }
            index++;
          }, 100)
        }
      }).catch(error => {
        clearInterval(this.loadLoop);
        this.sendFlag = false
        this.sendData = this.oldSendData
        showToast({message: "请求失败或超时，请重新发送请求.", duration: 5000});
        this.messageList.length = this.messageList.length - 1;
        console.log(JSON.stringify(error))
      })
    }

    return {
      sendData,
      oldSendData,
      sendFlag,
      streamFlag,
      messageList,
      loadLoop,
      sendMessage,
      loadFlash,
      postRequest
    };
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  position: fixed;
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  overflow: hidden;
  max-width: 540px;
  margin: 0 auto;
}

.content {
  width: 100%;
  height: 100vh;
  margin-bottom: 90px;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #F3F3D9;
}

.visitor, .robot {
  position: relative;
  display: flex;
}

.visitor {
  justify-content: flex-end;
}

img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  padding: 10px 15px;
}


.text {
  max-width: calc(100% - 150px);
  word-break: normal;
  position: relative;
  height: auto;
  background: #fff;
  min-height: 24px;
  padding: 8px 12px;
  margin: 14px 0 14px -6px;
  border-radius: 5px;
}

.text:nth-of-type(even) {
  background: #95ec69;
  margin: 14px -6px 14px 0;
}

.text:nth-of-type(odd)::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #fff;
  transform: rotate(45deg);
  left: -4px;
  top: 15px;
}

.text:nth-of-type(even)::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #95ec69;
  transform: rotate(45deg);
  right: -4px;
  top: 15px;
}

.bottom {
  display: flex;
  padding: 10px 10px 35px;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: space-between;
  background: rgb(244, 244, 244, .1);
  position: fixed;
  max-width: 520px;
  margin: 0 auto;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.van-field {
  flex: 1;
  height: 44px;
  line-height: 25px;
  border-radius: 5px;
  margin: 0 5px;
  font-size: 16px;
}

button {
  width: 85px;
  height: 44px;
  font-size: 16px;
}

/deep/ .github-markdown-body {
  font-size: 16px !important;
  line-height: 24px !important;
  padding: 0 !important;
}

/deep/ .github-markdown-body p {
  margin: auto !important;
}

/deep/ .v-md-pre-wrapper {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
