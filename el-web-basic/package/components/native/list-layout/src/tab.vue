<!--
 * @Author: 段丽军
 * @Date: 2022-09-07 17:11:03
 * @LastEditTime: 2022-09-16 15:16:45
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/tab.vue
-->
<script lang="jsx">
// import ElTabs from 'element-ui/packages/tabs';
// import ElTabPane from 'element-ui/packages/tab-pane';
import getSlot from './mixins/getSlot.js';
export default {
  components: {
    // ElTabs,
    // ElTabPane,
  },
  props: {
    tabs: {
      type: Array,
      default: _=> [],
    },
    activeName: {
      type: String,
      default: '',
    },
  },
  mixins: [getSlot],
  data() {
    return {
      tipsFold: false,
      newActiveName: null,
    };
  },
  watch: {
    activeName: {
      handler(nv) {
        if(nv !== this.newActiveName) {
          this.newActiveName = nv;
        }
      },
      immediate: true,
    },
    newActiveName(nv) {
      this.$emit('changeActiveName', nv);
    }
  },
  render() {
    const { getSlot, tabs } = this,
    self = this;

    const slot = getSlot('default');

    const body = slot || ( tabs && tabs.length > 0 ?
      <ElTabs v-model={self.newActiveName}>
        {tabs.map(item=> <ElTabPane label={item.label} name={item.value} />)}
      </ElTabs> : null
    );
    return body ? (<div class="e-list-layout-container">{body}</div>) : null;
  }
}
</script>
<style lang="scss" scoped>
  .e-list-layout-container {
    padding-bottom: 0!important;
  ::v-deep .el-tabs .el-tabs__header {
      margin: 0!important;
    }
  }
</style>
