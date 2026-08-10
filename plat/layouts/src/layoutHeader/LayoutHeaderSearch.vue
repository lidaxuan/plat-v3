<!--
 * @Description: 
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/ui/components/layouts/src/layoutHeader/LayoutHeaderSearch.vue
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-03 17:57:15
-->
<template>
  <icon-class padding-left="5px" icon-class="icon-C-C5" font="20" color="var(--layoutTopMenuCol)">{{ layoutSetting.layout.value == '0' ? 'Search...' : '' }}</icon-class>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutHeaderSearch',
  computed: {
    ...mapGetters(['layoutSetting'])
  }
};
</script>


