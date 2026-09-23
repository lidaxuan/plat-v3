<!--
 * @Author: 赵春旭
 * @Date: 2021-08-26 14:56:36
 * @LastEditTime: 2022-12-29 15:24:29
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/user-center-iframe/src/main.vue
-->
 <!-- <user-center-iframe
 token="xxxxx"
 sys-id="90000"
 role-name="role"
 env="dev"/> -->
<template>
  <div class="user-center-wrap" v-loading="loading">
    <iframe :src="frmSrc" frameborder="0" id="frameRole"></iframe>
  </div>
</template>
<script>
export default {
  name: 'EUserCenterIframeN',
  data () {
    return {
      frmSrc: `${this.getUrl()}/auth-eupms/vi/ad/${this.sysId}?code=${this.roleName}&access_token=${this.token}`,
      loading: false,
    }
  },
  props: {
    baseUrl: {
      type: String
    },
    token: {
      required: true,
      type: String
    },
    sysId: { // 10000 90000 ...
      required: true,
      type: String
    },
    roleName: { // role user department ...
      required: true,
      type: String
    },
    env: { // dev test online
      type: String,
      default: () => 'online'
    }
  },
  methods: {
    getUrl() {
      if(this.baseUrl) {
        return this.baseUrl;
      }
      let url = ''
      if(this.env == 'dev') {
        url = 'http://test-prd18.easyliao.net'
      } else if (this.env == 'test') {
        url = 'http://test-prd18.easyliao.net'
      } else if (this.env == 'online') {
        url = 'https://pre-auth.easyliao.com'
      } else if (this.env == 'txprd') {
        url = 'https://tencent-auth2.easyliao.com'
      }
      return url
    },
    postToIframe() { // 提供向iframe内post指令 使iframe内做出相应操作
      let iframeWin = document.querySelector('#frameRole').contentWindow;
      iframeWin.postMessage({
        type:'hideButton',
        data:{
          val:'hello the button is hide'
        }
      },'*')
    },
    addListener() { // 监听iframe内部post过来的指令，从而做出相应操作
      window.addEventListener('message', (e) => {
        switch(e.data.type) {
          case 'goBack':
            this.$router.go(-1);
            break;
          case 'hideButton':
            console.log('hello the button is hide');
            break;
          default: break;
        }
      }, false);
    }
  },
  created() {
    this.loading = true;
    this.addListener();
  },
  mounted() {
    document.querySelector('#frameRole').onload = () => {
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.user-center-wrap{
  height:100%;
  #frameRole{
    width: 100%;
    height: 100%;
  }
}
</style>
