/* * @Author: web.王晓冬 * @Date: 2020-05-21 15:23:42 * @LastEditors: web.于涛 * @LastEditTime:
2020-06-22 19:29:13 * @Description: 对话记录 * @props: id{Number,Sting} 是否显示头像 默认:true *
@props: avatar{Boolean} 是否显示头像 默认:true * @props: group{Boolean} 是否显示头像 默认:true *
@props: bubble{Boolean} 是否显示气泡 默认:true * @props: senderRight{senderRight}发送者是否居右
默认:true

<template>
  <el-scrollbar style="height:100%" v-loading="loading">
    <div class="eim-chat-main">
      <div v-if="!recordData.length" class="ac">
        <img src="./images/dialog_empty.png" alt />
        <p style="font-size:14px;color:#434b6a">暂无对话记录</p>
      </div>

      <el-collapse v-else v-model="activeName" accordion>
        <template v-for="(item, index) in recordData">
          <el-collapse-item :key="index" v-if="item.length" :title="item[0] ? item[0].CREATETIME : ''" :name="index">
            <div class="eim-chat-system-tips">
              <i class="el-icon-info"></i>
              {{ item[0] ? item[0].CREATETIME : "" }} 通过
              {{ getInviteMode(item[0] ? item[0].INVITE_MODE : "") }} 建立对话
            </div>
            <chat-list :activeName="activeName" :data="item" :footerList="footerList" :contrast="contrast" :name="params" v-bind="$props"></chat-list>
            <div v-if="item[0] ? item[0].ENDTIME : true" class="eim-chat-system-tips">
              <i class="el-icon-info"></i>
              {{ item[0] ? item[0].ENDTIME : "" }}
              {{ getCloseType(item[0] ? item[0].CLOSE_TYPE : "") }}
            </div>
            <div v-else class="eim-chat-system-tips">
              <i class="el-icon-info"></i>
              对话未结束
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
      <!-- <chat-list v-if="!group && recordData.length" :data="recordData" v-bind="$props"></chat-list> -->
    </div>
  </el-scrollbar>
</template>

<script>
import chatList from "./chat-list.vue";
import axios from "axios";
const http = axios.create({
  // baseURL: "/clues",
  // baseURL: "/apis",
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Authorization': localStorage.getItem('token')
  }
});
// 可以对axios 配置
const IS_PROD = process.env.NODE_ENV === 'production';
http.defaults.baseURL = IS_PROD ? "/clues/Service" : "/clues";
//例如：import 《组件名称》 from '《组件路径》';
export default {
  name: "EChatRecordSp",
  components: { chatList },
  props: {
    id: [String, Number],
    params: Object,
    group: {
      type: Boolean,
      default: true,
    },
    // 是否显示头像
    avatar: {
      type: Boolean,
      default: true,
    },
    // 是否显示气泡
    bubble: {
      type: Boolean,
      default: true,
    },
    // 发送者气泡位置
    senderRight: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    //这里存放数据
    return {
      activeName: 0,
      loading: false,
      recordData: [],
      contrast: {},
      footerList: {},
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    params: {
      deep: true,
      handler(val) {
        this.activeName = 0;
        this.getChat();
      },
    },
  },
  //方法集合
  methods: {
    getInviteMode(val) {
      let str = "";
      switch (val) {
        case 1:
          str = "客服发起";
          break;
        case 2:
          str = "访客发起";
          break;
        // case 3:
        //   str = "内部会议室";
        //   break;
        case 4:
          str = "对话转移";
          break;
        case 5:
          str = "对话抢接";
          break;
      }
      return str;
    },
    getCloseType(value) {
      if (value == 1) return "访客结束对话";
      else if (value == 2) return "客服结束对话";
      else if (value == 3) return "对话转移结束对话";
      else if (value == 4) return "系统超时结束对话";
      else if (value == 5) return "对话抢接结束对话";
      else if (value == 6) return "正在进行对话";
      else return " ";
    },
    getChat() {
      let params = {
        visitor_static_id: this.params.visitor_static_id,
        s_starttime: this.params.startTime,
        s_endtime: this.params.endTime,
      };
      if (this.params.chatId && this.params.chatId != "undefined") {
        params.chatId = this.params.chatId;
      }
      this.loading = true;
      http.post("/cardsMan/queryChatRecordDetail", params).then((res) => {
        this.loading = false;
        const data = JSON.parse(res.data.data) || {};
        let rows = [];
        if (data.rows.length) {
          if (!data.rows[0].length) {
            rows = [];
          } else {
            rows = data.rows;
          }
        } else {
          rows = [];
        }
        this.recordData = rows;
        this.footerList = {};
        data.footer.forEach((prev, next) => {
          this.footerList[prev.id] = prev.test;
        });
      });
      http.post("/ChatCrm/getLeaveMsgAllUser").then((res) => {
        let data = res.data.data || [];
        const contrast = {};
        data.forEach((item) => {
          contrast[item.USER_ID] = item.REAL_NAME;
        });
        this.contrast = contrast;
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getChat();
    // this.getChatGroup();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
el-main {
  padding: 10px;
}
.ac {
  position: absolute;
  top: 30%;
  left: 30%;
}
.eim-chat-main {
  height: 100%;
  padding: 0px 10px 5px 0px;
  overflow-x: hidden;
  overflow-y: auto;
}
.eim-chat-system-tips {
  font-size: 12px;
  color: #666;
  background: #f7f7f7;
  height: 24px;
  line-height: 24px;
  border-radius: 10px;
  text-align: center;
  i {
    font-size: 14px;
    vertical-align: -1px;
    margin-right: 5px;
  }
}
</style>
