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
    <el-image src="../assets/img/error/err404.gif" fit="contain">
      <template #placeholder>
        <div class="image-slot">加载中<span class="dot">...</span></div>
      </template>
    </el-image>
    <div class="error-desc ml-20" font="22">目前服务器繁忙、请您稍后再试！</div>
  </div>
</template>

<script>
export default {
  name: 'err404',
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
