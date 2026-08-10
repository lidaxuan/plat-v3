<!--
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /data-web-view/node_modules/el-ui/pages/err404.vue
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-08 15:03:48
-->
<template>
  <div width="100%" height="100%" class="error-page flex jc-center ai-center flex-column">
    <!--        <div class="error-code">4<span>0</span>4</div>-->
    <!--        <div class="error-desc">啊哦~ 你所访问的页面不存在</div>-->
    <el-image :src="errgif">
      <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
    </el-image>
    <div class="error-desc ml-20" font="22">目前服务器繁忙、请您稍后再试！</div>
    <!-- <div class="error-handle">
      <router-link to="/index">
        <el-button type="primary" size="large">返回首页</el-button>
      </router-link>
      <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'err404',

  data() {
    return {
      errgif: require('./err404.gif')
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/base/common/index";
.error-page {
  background: $-color-F1F4FA;
  box-sizing: border-box;

  .error-desc {
    color: $-color-2D419B;
  }
}
/*.error-code span {*/
/*    color: #00a854;*/
/*}*/
/*.error-code {*/
/*    line-height: 1;*/
/*    font-size: 250px;*/
/*    font-weight: bolder;*/
/*    color: #2d8cf0;*/
/*}*/

/*.error-handle {*/
/*    margin-top: 30px;*/
/*    padding-bottom: 200px;*/
/*}*/

/*.error-btn {*/
/*    margin-left: 100px;*/
/*}*/
</style>
