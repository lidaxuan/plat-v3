<!--
 * @Author: 段丽军
 * @Date: 2022-09-05 16:13:38
 * @LastEditTime: 2022-09-29 10:01:53
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/tips.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
export default {
  mixins: [getSlot],
  data() {
    return {
      tipsFold: true,
    };
  },
  methods: {
    change() {
      this.tipsFold = !this.tipsFold;
    }
  },
  render() {
    const { getSlot, tipsFold, change } = this;
    const slot = getSlot('default');
    return slot ? (
      <div class="e-list-layout-container">
        <div class="e-tips" style={`max-height: ${tipsFold ? 45 : 1000}px;`}>
          <e-button-n type="text-primary" onClick={ () => change() } icon="icon-F-F9" icon-position="right"
            isFold={tipsFold} style="line-height: 14px;"/>
            {slot}
          <div style="background-color: #F1F4FA; width: calc(100% - 32px); position: absolute; bottom: 0; height: 10px;" />
        </div>
      </div>
    ) : null;
  }
}
</script>
<style lang="scss" scoped>
  @import '../../../../style/tips/index.scss';
  .e-list-layout-container {
    padding-bottom: 0!important;
  }
</style>