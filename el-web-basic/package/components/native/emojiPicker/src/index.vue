<template>
  <div class="emoji-picker">
    <el-popover placement="top-start" width="432" trigger="click" popper-class="popover-wrapper">
      <div>
        <div class="emoji-grid">

          <!-- 预设渠道表情 -->
          <template v-if="selectedChannel !== 'custom'">
            <div class="emoji-cell" v-for="(src, name) in emojiList" :key="name" @click="inputEmoji(src, name)">
              <el-tooltip effect="dark" :content="name" placement="top" :open-delay="300" :enterable="false">
                <img :src="src"/>
              </el-tooltip>
            </div>

            <div class="emoji-placeholder" v-for="n in presetFillCount" :key="'p-' + n"></div>
          </template>

          <!-- 自定义表情 -->
          <template v-else>
            <el-upload class="upload-btn" :show-file-list="false" action="/console/material/overseas/library/upload" multiple :before-upload="beforeUpload" :http-request="e => uploadFile(e, 'IMAGE')">
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="custom-emoji" v-for="(item, index) in emojiList" :key="'c-' + index" @click="selectCustomEmoji(item)">
              <i v-if="deleteMode" class="el-icon-error delete-icon"></i>
              <img :src="item.filePath"/>
            </div>

            <div class="custom-placeholder" v-for="n in customFillCount" :key="'pc-' + n"></div>
          </template>
        </div>

        <!-- 底部切换栏 -->
        <div class="flex jc-between toolbar">
          <div class="channel-list">
            <div class="channel-item" v-for="(ch, index) in channelList" :key="'ch-' + index" :class="{ active: ch.channelId === selectedChannel }">
              <el-button type="text" style="padding: 0" @click="switchChannel(ch)">
                <i v-if="ch.channelId === 'custom'" class="iconfont icon-Y99 channel-icon-custom" style="color: #444A58;"></i>
                <img v-else :src="ch.icon" class="channel-icon"/>
              </el-button>
            </div>
          </div>

          <!-- 删除按钮 -->
          <div class="delete-toggle">
            <i v-if="selectedChannel === 'custom'" class="el-icon-delete-solid" @click="deleteMode = !deleteMode" :style="{ color: deleteMode ? '#444A58' : '#ACB2C9' }"></i>
          </div>
        </div>
      </div>

      <span slot="reference">
        <slot></slot>
      </span>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "EEmojiPicker",
  props: {
    searchEngineId: {
      type: [String, Number],
      default: 0
    },
    isCustom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      channelList: [],
      emojiList: [],
      selectedChannel: "0",
      formState: {
        aiBotName: "",
        webSite: "",
        artificialUsers: [],
        headUrl: "",
        companyId: "",
        userId: ""
      },
      deleteMode: false
    };
  },

  computed: {
    /** 预设表情补位：每行 11 个 */
    presetFillCount() {
      const n = Object.keys(this.emojiList).length;
      return (11 - n % 11) % 11;
    },
    customFillCount() {
      return (5 - this.emojiList.length % 5) % 5;
    }
  },

  created() {
    const channelInfo = window.ELBaseUtils.imgBase.getChannel({type: "channel", channelId: this.searchEngineId});
    channelInfo.channelId = this.searchEngineId;

    const channels = [channelInfo];
    if (this.isCustom) {
      channels.push({name: "自定义", icon: "iconfont icon-Y99", channelId: "custom"});
    }

    this.channelList = channels;
    this.switchChannel(channels[0]);
  },

  methods: {
    /** 选择预设表情 */
    inputEmoji(val, key) {
      this.$emit("selectEmoji", key, val);
    },
    /** 选择自定义表情 */
    selectCustomEmoji(item) {
      this.$emit("selectImg", item);
    },
    /** 切换渠道 */
    switchChannel(channel) {
      this.selectedChannel = channel.channelId;
      if (channel.channelId === "custom") {
        this.loadCustomEmoji();
        return;
      }
      this.emojiList = window.ELBaseUtils.imgBase.getEmoji({type: "channel", channelId: channel.channelId});
    },
    /** 获取用户自定义表情 */
    loadCustomEmoji() {
      const res = {
        msg: "成功",
        code: 200,
        data: Array(9).fill({
          filePath: "https://webcall-oss.easyliao.com/1/2025/10/27/eab604bd75634a159eb95b715e9fd412.png"
        }).concat([
          {
            companyId: 1,
            createTime: 1761556749000,
            createUserId: "dev-ljx1",
            fileName: "1/2025/10/27/59f2f1e0d36c4be0913374b2aba2a191.jpg",
            fileObjectName: "1/2025/10/27/59f2f1e0d36c4be0913374b2aba2a191.jpg",
            filePath: "https://webcall-oss.easyliao.com/1/2025/10/27/59f2f1e0d36c4be0913374b2aba2a191.jpg",
            fileSize: 0,
            fileSuffix: "jpg",
            groupId: 0,
            id: 94,
            sfId: 792803774346297344,
            snowflakeId: "792803774346297344",
            sort: 2,
            type: 1,
            userId: "dev-ljx1"
          }
        ]),
        succeed: true
      };

      this.emojiList = res.data;
    },
    /** 上传前校验 */
    beforeUpload(file) {
      if (file.size / 1024 / 1024 >= 1) {
        this.$message.warning("文件上传大小不得超过1MB！");
        return false;
      }
      const types = [
        "image/bmp", "image/jpg", "image/jpeg", "image/png", "image/tif", "image/tiff", "image/gif", "image/pcx",
        "image/tga", "image/exif", "image/fpx", "image/svg+xml", "image/psd", "image/cdr", "image/pcd", "image/dxf",
        "image/ufo", "image/eps", "image/ai", "image/raw", "image/wmf"
      ];
      if (!types.includes(file.type.toLowerCase())) {
        this.$message.error("仅支持上传以下图片格式：bmp、jpg、jpeg、png、tif、gif、pcx、tga、exif、fpx、svg、psd、cdr、pcd、dxf、ufo、eps、ai、raw、wmf");
        return false;
      }
    },
    /** 自定义上传 */
    uploadFile(param, fileType) {
      const fd = new FormData();
      fd.append("file", param.file);
      fd.append("jsSkinConfId", this.configId);
      fd.append("fileEnum", fileType);
      fd.append("windowLogoObjectName", this.objectName);
      window.EWebPlat.platService(window.webClientApiMap.consoleWeb.uploadPictureHw, fd)
              .then(res => {
                if (res.code === 0) {
                  this.formState.headUrl = res.data.url;
                  this.objectName = res.data.objectName;
                } else {
                  this.formState.headUrl = "";
                  this.objectName = "";
                  this.$message.error(res.msg);
                }
              })
              .catch(() => {
                this.uploading = false;
                this.progressPercent = 0;
              });
    }
  }
};
</script>

<style>
.popover-wrapper {
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.popover-wrapper {

  .upload-btn {
    width: 68px;
    height: 68px;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 15px;
  }

  .emoji-grid {
    width: 100%;
    height: 215px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 16px;
    justify-content: space-between;

    .emoji-cell {
      width: 35px;
      height: 35px;
      padding: 5px;
      cursor: pointer;
      border-radius: 10px;

      &:hover {
        padding: 3px;
        background-color: #f1f1f1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .emoji-placeholder {
      width: 35px;
      height: 35px;
    }

    .custom-emoji {
      position: relative;
      width: 68px;
      height: 68px;
      margin-bottom: 15px;

      .delete-icon {
        position: absolute;
        right: -7px;
        top: -7px;
        font-size: 14px;
        cursor: pointer !important;

        &:hover {
          transition: all 0.5s;
          font-size: 16px;
        }
      }

      img {
        width: 68px;
        height: 68px;
        border-radius: 8px;
        cursor: pointer;
      }
    }

    .custom-placeholder {
      width: 68px;
      height: 68px;
    }
  }

  .toolbar {
    box-shadow: 0 -3px 5px #eee;
    background: #f9f8fd;
    padding: 0 10px 0 17px;

    .channel-list {
      display: flex;
      align-items: center;
      overflow-x: auto;
      height: 44px;
      width: calc(100% - 24px);

      .channel-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        margin-right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 4px;

        &:hover, &.active {
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .channel-icon {
        width: 24px;
        height: 24px;
      }

      .channel-icon-custom {
        font-size: 24px;
      }
    }

    .delete-toggle {
      cursor: pointer;
      font-size: 20px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
