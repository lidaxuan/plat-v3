/* * @Author: web.王晓冬 * @Date: 2020-06-02 17:35:11 * @LastEditors: web.于涛 * @LastEditTime:
2020-07-24 10:19:14 * @Description: file content */

<template>
  <div>
    <ul class="eim-chat-box" :class="{ bubble: bubble }">
      <li
        v-for="item of data"
        :key="item.id"
        :class="{
          'eim-chat-mine': item.SENDER_TYPE == 1?false:true,
          'eim-chat-other': item.SENDER_TYPE == 3,
          right: item.SENDER_TYPE == 1?false:true,
          'eim-avatar-show': avatar
        }"
      >
        <template v-if="item.SENDER_TYPE!=2">
          <div class="eim-chat-user">
          <span
            v-if="avatar"
            :style="getAvatar(item.SENDER_TYPE, item.ROBOT, item.TYPE, item.RECORDER_ID)"
            class="eim-chat-avatar"
          ></span>
          </div>
          <div class="eim-chat-user position-re">
            <cite>
            <span class="eim-chat-name">
              {{
              item.SENDER_TYPE == 0
              ? footerList[item.FROMID] || item.FROMID
              : params.NAME || visitorFieldFormat(item.FROMID)
              }}
              &nbsp;({{ item.CREATE_TIME | formatTimeNotRefined }})
            </span>
            </cite>
          </div>
          <!-- -->
          <div class="eim-chat-text">
            <!-- 图片内容 -->
            <div v-if="item.TYPE == 'RECORD_SCREENSHOTS' || item.TYPE == 'RECORD_FILE'">
              <el-image
                class="eim-chat-img b-radius"
                v-if="isFileType(item, 'img')"
                :preview-src-list="[item.MESSAGE]"
                :src="item.MESSAGE"
              ></el-image>
              <!-- 视频内容 -->
              <video
                width="100%"
                height="100%"
                controls
                class="eim-chat-video b-radius"
                :src="item.MESSAGE"
                v-else-if="isFileType(item, 'video')"
              >您的浏览器不支持 video 标签。</video>
              <!-- 音频内容 -->
              <audio
                class="eim-chat-audio"
                controls
                :src="item.MESSAGE"
                v-else-if="isFileType(item, 'audio')"
              >您的浏览器不支持 audio 标签。</audio>
              <!-- 附件内容 -->
              <div class="eim-chat-file b-radius" v-else-if="isFileType(item, 'file')">
                <div class="e-flex pb10">
                  <span class="eim-chat-file-icon" :style="getFileType(item)"></span>
                  <div class="f12 ml5" style="line-height:18px">
                    <p class="e-elip" style="width:150px;">{{ item.MESSAGE }}</p>
                    <!-- <p class="e-text-gray">15.5kb</p> -->
                  </div>
                </div>
                <div class="eim-chat-file-opera ac e-flex-hor">
                  <div>
                    <i class="iconfont greenColor iconduihuajilu-fujianfasongchenggong"></i>
                    <span>发送成功</span>
                  </div>
                  <div>
                    <a download="附件" target="_blank" :href="item.MESSAGE">
                      <i class="iconfont iconduihuajilu-fujianxiazai"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p class="next-line revoke" v-else-if="item.TYPE === 'EVENT_RECORD_REVOKE'">
            <span>
              客服&nbsp;{{
              item.SENDER_TYPE == 0
              ? footerList[item.FROMID] || item.FROMID
              : params.NAME || visitorFieldFormat(item.FROMID)
              }}
            </span>撤回了一条消息
            </p>
            <!-- 文本内容 -->
            <span class="eim-chat-txt" v-else v-html="item.MESSAGE"></span>
          </div>
        </template>
        <template v-else>
          <div class="tips">
            <el-tooltip class="item" effect="dark" :content="item.MESSAGE" placement="bottom">
              <span> {{item.CREATETIME}} 系统消息：{{item.MESSAGE}} </span>
            </el-tooltip>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
  //0客服 1me 2访客 3机器人 4监控者
  const AVATAR_TYPE = {
    0: "-32px -160px",
    1: "0 -224px",
    2: "0 -64px",
    3: "-32px -128px",
    4: "0 0",
    5: "-32px -192px",
  };

  const FILE_TYPE = {
    doc: "-30px -108px",
    docs: "-30px -108px",
    docx: "-30px -108px",
    zip: "-30px 0",
    ppt: "0 -108px",
    txt: "0 -144px",
    xls: "0 0",
    xlsx: "0 0",
    pdf: "0 -72px",
    html: "-30px -144px",
  };
  //例如：import 《组件名称》 from '《组件路径》';
  export default {
    name: "chat-list",
    props: {
      data: {
        type: Array,
        default: [],
      },
      footerList: {
        type: Array,
        default: () => {},
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
      params: Object,
      contrast: Object,
      activeName: [String, Number],
    },

    data() {
      //这里存放数据
      return {
        heightList: [],
        remokeList: [],
        customList: [],
      };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
      data: {
        deep: true,
        handler(val) {
          this.remokeList = [];
          if (val && val.length > 0) {
            let reg = /\[(\d*)\]/g;
            this.data.map((v) => {
              if (v.MESSAGE) {
                let match = v.MESSAGE.match(reg) || [];
                match.forEach((emjoy) => {
                  v.MESSAGE = v.MESSAGE.replace(
                    reg,
                    `<i class="emjoy emjoy${emjoy.substring(1, 3)}"></i>`
                  );
                });
                if(v.MESSAGE.indexOf('data-form') != -1){
                  var left =  v.MESSAGE.replace(/\&lt\;/g,'<');
                  var right = left.replace(/\&gt\;/g,'>');
                  var quotation = right.replace(/\&quot\;/g,'"');
                  v.MESSAGE = quotation
                }
              }
              if (v.TYPE === "EVENT_RECORD_REVOKE") {
                this.remokeList.push(+v.MESSAGE);
              }
            });
          }
          this.imgClick();
        },
      },
    },
    //方法集合
    methods: {
      // 格式化访客标识
      visitorFieldFormat(val) {
        if (val != null && val.length >= 5) {
          let v =
            "" +
            val.charCodeAt(val.length - 5) +
            val.charCodeAt(val.length - 4) +
            val.charCodeAt(val.length - 3) +
            val.charCodeAt(val.length - 2) +
            val.charCodeAt(val.length - 1);
          if (v.length > 7) {
            v = v.substring(0, 7);
          }
          return v;
        }
        return "" + val;
      },
      // 头像使用精灵图 获取头像坐标
      getAvatar(type, robot, itemType, recorderId) {
        // item.TYPE === 'EVENT_RECORD_REVOKE' || remokeList.indexOf(item.RECORDER_ID) !== -1
        let num = "";
        if (type != 1) {
          if ((robot == 0 || robot == 1) && robot !== undefined) {
            num = 0;
          } else {
            num = 3;
          }
        } else {
          num = type;
        }
        if (itemType && recorderId) {
          if (
            itemType === "EVENT_RECORD_REVOKE" ||
            this.remokeList.indexOf(recorderId) !== -1
          ) {
            num = 5;
          }
        }
        return `background-position: ${AVATAR_TYPE[num]};`;
      },
      // 附件使用精灵图 获取附件坐标
      getFileType(item) {
        if (item.MESSAGE) {
          let val = item.MESSAGE || "";
          let l = val.split(".");
          let type = l[l.length - 1];
          return `background-position: ${FILE_TYPE[type]};`;
        }
      },
      getSenderDetailInfo(sendType, visitorName, FROM_ID, type) {
        const customerName =
          this.contrast[FROM_ID] == undefined
            ? "" + FROM_ID
            : "" + this.contrast[FROM_ID];
        let str = "";
        if (sendType == 1) {
          str = "访客:" + visitorName;
        } else if (sendType == 2 && type == "RECORD_SYSTEM") {
          str = "系统:消息自动回复";
        } else {
          str = "客服:" + customerName;
        }
        return str;
      },
      // 判断文件类型
      isFileType(item, fileType) {
        let types = {
          img: "bmp/gif/jpeg/png/screenShots/mpeg/jpg",
          file: "txt/pdf/doc/docx/xls/xlsx/ppt/pptx/zip/rar/html",
          video: "mp4/ogg/webm",
          audio: "m4a/aac/mp3/wav",
        };
        let val = item.MESSAGE || "";
        let l = val.split(".");
        let type = l[l.length - 1];
        return types[fileType].indexOf(type.toLowerCase()) != -1 ? true : false;
      },
      formatPhone(text) {
        if (text) {
          var getNum = text.replace(/[^0-9]/gi, "");
          if (getNum.length == 11) {
            //3.截取所有数字，并用*替换4，4
            var phnumAfter = getNum.substr(0, 3) + "****" + getNum.substr(7);
            return text.replace(getNum, phnumAfter);
          } else {
            return text;
          }
        }
      },
      handleClickOpen(list) {
        list.forEach((v) => {
          v.onclick = () => {
            if (v.src) {
              // window.location.href = v.src;
              window.open(v.src);
            }
          };
        });
      },
      imgClick() {
        this.$nextTick(() => {
          setTimeout(() => {
            let imgs = document.querySelectorAll(".eim-chat-txt img");
            this.handleClickOpen(imgs);
          }, 0);
        });
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      if (this.data && this.data.length) {
        this.remokeList = [];
        let reg = /\[(\d*)\]/g;
        this.data.map((v) => {
          if (v.MESSAGE) {
            let match = v.MESSAGE.match(reg) || [];
            match.forEach((emjoy) => {
              v.MESSAGE = v.MESSAGE.replace(
                reg,
                `<i class="emjoy emjoy${emjoy.substring(1, 3)}"></i>`
              );
            });
            if(v.MESSAGE.indexOf('data-form') != -1||v.MESSAGE.indexOf('domFilter') != -1){
              var left =  v.MESSAGE.replace(/\&lt\;/g,'<');
              var right = left.replace(/\&gt\;/g,'>');
              var quotation = right.replace(/\&quot\;/g,'"');
              v.MESSAGE = quotation
            }
          }
          if (v.TYPE === "EVENT_RECORD_REVOKE") {
            this.remokeList.push(+v.MESSAGE);
          }
        });
      }
      this.imgClick();
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
  };
</script>
<style lang="scss" scoped>
  $e-im-primary: #1e95ff;
  $e-im-info: #eee;
  $e-im-other: #ffefe4;
  .b-radius {
    border-radius: 5px;
    border: 1px solid #d7d7d7;
  }
  .position-re {
    position: relative !important;
  }
  .eim-chat-box {
    //发送人
    li {
      position: relative;
      font-size: 0;
      margin-bottom: 10px;
      padding-left: 0px;
      min-height: 48px;
      padding-right: 40px;

      .eim-chat-text,
      .eim-chat-user {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      .position-re {
        margin-left: -45px;
        width: calc(100% + 60px);
      }
      .tips {
        height: 24px;
        line-height: 24px;
        border-radius: 10px;
        text-align: center;
        margin-top: 5px;
        cursor: pointer;
        font-size: 12px;
        color: #666;
        span {
          display: inline-block;
          width: 240px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        i {
          color: #ff931f;
          vertical-align: middle;
        }
      }
      .eim-chat-user {
        position: absolute;
        left: 3px;
        .eim-chat-avatar {
          display: inline-block;
          background: url(./images/avatar.png) no-repeat;
          background-position: 0 -224px;
          width: 32px;
          height: 32px;
          border-radius: 100%;
        }
        cite {
          position: relative;
          font-style: normal;
          left: 0px;
          top: -2px;
          width: 500px;
          line-height: 24px;
          font-size: 12px;
          white-space: nowrap;
          color: #67c23a;
          text-align: left;
          font-style: normal;
          .eim-chat-name {
            display: inline-block;
            width: 320px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            white-space: normal;
          }
          i {
            // padding-left: 15px;
            font-style: normal;
          }
        }
      }
      .eim-chat-text {
        max-width: 260px;
        .eim-chat-txt {
          line-height: 22px;
          border-radius: 0 12px 12px 12px;
          background: #1e95ff;
          float: left;
          color: #fff;
          padding: 10px;
          max-width: 260px;
          ::v-deep em,
          ::v-deep i,
          ::v-deep var {
            font-style: italic;
          }
          ::v-deep img,
          ::v-deep video {
            max-width: 260px;
            vertical-align: middle;
          }

          ::v-deep b,
          ::v-deep strong {
            font-weight: bolder;
          }
          ::v-deep p {
            font-weight: normal;
            font-style: normal;
            text-decoration: initial;
            font-family: 微软雅黑;
            color: #000;
            margin: 5px 0;
          }
        }
        position: relative;
        margin-top: -8px;
        padding: 0;
        margin-left: 0;
        text-align: left;
        border-radius: 3px;
        color: #333;
        word-break: break-all;
      }
      // 是否显示头像内容
      &.eim-avatar-show {
        padding-left: 45px;
        .eim-chat-user {
          cite {
            left: 45px;
            color: #999;
          }
        }
      }
    }
    .eim-chat-mine {
      .eim-chat-user {
        cite {
          color: $e-im-primary;
        }
      }
    }
    // 默认发送者的在左侧.
    // 如果发送者位置在右侧
    .eim-chat-mine.right {
      text-align: right;
      padding-left: 40px;
      padding-right: 0px;
      .position-re {
        margin-left: -15px;
      }
      .eim-chat-file {
        border-radius: 12px 0 12px 12px;
      }

      .eim-chat-user {
        left: auto;
        right: 3px;
        cite {
          left: auto;
          right: 0px;
          text-align: right;
          span {
            display: inline-block;
            width: 320px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            white-space: normal;
            // float: right;
          }
          i {
            padding-left: 0;
            padding-right: 0;
          }
        }
      }
      // 是否显示头像内容
      &.eim-avatar-show {
        padding-right: 45px;
        .eim-chat-user {
          cite {
            right: 45px;
            color: #999;
          }
        }
      }
      .eim-chat-text {
        .eim-chat-txt {
          border-radius: 12px 0 12px 12px;
          background: #ffefe4 !important;
          float: right;
          color: #434d6a !important;
          padding: 10px;
          // &::after {
          //   left: auto;
          //   right: -10px;
          //   border-top-color: $e-im-primary;
          // }
        }
      }
    }
  }
  //默认没有气泡.
  // 如果有气泡的样式
  .eim-chat-box.bubble {
    //发送人
    li {
      .eim-chat-user {
        cite {
          color: "#999";
        }
      }
    }

    .eim-chat-text {
      .eim-chat-txt {
        display: inline-block;
        padding: 8px 10px;
        // background-color: $e-im-info;
        // &::after {
        //   content: "";
        //   position: absolute;
        //   left: -10px;
        //   top: 6px;
        //   width: 0;
        //   height: 0;
        //   border-style: solid dashed dashed;
        //   border-color: $e-im-info transparent transparent;
        //   overflow: hidden;
        //   border-width: 10px;
        // }
      }
    }
    .eim-chat-mine {
      .eim-chat-text {
        .eim-chat-txt {
          background-color: $e-im-primary;
          color: #fff;
          &::after {
            border-color: $e-im-primary transparent transparent;
          }
        }
      }
      &.eim-chat-other {
        .eim-chat-text {
          .eim-chat-txt {
            background-color: $e-im-other;
            color: #434d6a;
            &::after {
              border-color: $e-im-other transparent transparent;
            }
          }
        }
      }
    }
  }

  .eim-chat-img,
  .eim-chat-video {
    width: 200px;
  }
  .eim-chat-img {
    height: 120px;
  }
  .eim-chat-file {
    width: 240px;
    box-sizing: border-box;
    background-color: #fff;
    border: 2px solid #e2e8ef;
    border-radius: 0 12px 12px 12px;
    padding: 8px 8px 0 8px;

    .eim-chat-file-icon {
      max-width: 32px;
      display: block;
      width: 30px;
      height: 36px;
      background: url(./images/fileFormat.png) no-repeat;
      &::after {
        content: "";
        display: block;
      }
    }
    .greenColor {
      color: #00d46c !important;
    }
    // 附件工具栏
    .eim-chat-file-opera {
      justify-content: space-between;
      a {
        &:hover {
          color: $e-im-primary;
        }
      }
      // padding-top: 8px;
      font-size: 12px;
      text-align: center;
      border-top: 1px solid $e-im-info;
    }
  }
  .eim-chat-audio {
    width: 270px;
    &:focus {
      outline: 0px solid #efefef;
    }
  }
  ::v-deep .form-content{
    box-sizing: border-box;padding: 20px;margin: auto;border: 1px solid #EEEEEE;box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.08);border-radius: 4px;
    .input{
      height: 32px;border: 1px solid #EEEEEE;border-radius: 4px;margin-top: 10px;width:100%;text-indent:10px
    }
    .form-title{
      font-size: 18px;font-family: Microsoft YaHei;font-weight: 400;color: #333;text-align: center;margin-bottom:10px;
    }
    .textarea>textarea{
      color: #333;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      padding: 8px 10px;
      height: 60px;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      text-indent:10px;
      margin-top:10px;
    }
    .input::placeholder{
      color: #BBBBBB;
      text-indent: 10px;
    }
    .select{
      height: 32px;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      margin-top: 10px;
    }
    .select>select{
      color: #333;
      outline: none;
      box-sizing: border-box;
      border: none;
      width: 100%;
      height: 100%;
      padding: 0 8px;
      background: #fff;
    }
    .datePickerContent{
      position: relative;
    }
    .datepicker{
      line-height: 32px;
    }
    .btn{
      text-align: center;margin-top: 15px;
    }
    .btn>span{
      display: inline-block;width: 88px;height: 32px;background: #3B90FA;border-radius: 4px;color: #fff;line-height: 32px;cursor: pointer;
    }
  }
  .form-content-pc{
    margin-bottom: 20px;
    box-shadow: 0px 0px 10px 0px rgba(64, 84, 97, 0.05) !important;
  }
  .form-content-phone{
    margin-bottom: 15px;
    box-shadow: 0px 0px 10px 0px rgba(64, 84, 97, 0.05) !important;
  }
</style>
