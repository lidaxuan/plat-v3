<!--
 * @Author: 段丽军
 * @Date: 2022-09-08 18:59:40
 * @LastEditTime: 2022-09-09 10:18:06
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/oper-bar.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
export default {
  mixins: [getSlot],
  methods: {
    getSlot(slotName, params) {
      return this.$scopedSlots[slotName] ? this.$scopedSlots[slotName](params) : null;
    },
  },
  render() {
    const { getSlot } = this,
    slot = getSlot('default', {
      buttonAttr: { size: "mini", type: "primary", minWidth: true },
    });

    return slot ? (<div class="e-list-layout-container">{slot}</div>) : null;
  }
}
</script>
<style lang="scss" scoped>
  .e-list-layout-container {
    padding-bottom: 0!important;
  }
</style>